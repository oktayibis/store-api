import express from "express";
import {
  ICart,
  IOrder,
  IOrderHistory,
  IProduct,
  IProductItem,
} from "../Interfaces";
import { CartValidations } from "../validations/cart.validation";
import {
  ErrorResponse,
  ErrorResponseWithMessage,
  SuccessResponse,
  SuccessResponseWithCostumField,
  ValidationErrorResponse,
} from "../utils/helpers";
import Stripe from "stripe";
import ProductSchema from "../schemas/Product.schemas";
import OrderSchemas from "../schemas/Order.schemas";
import { ORDER_STATUS, STATUS_EXPLAINATION } from "../utils/constants";
import UserSchema from "../schemas/User.schemas";

export async function addOrder(req: express.Request, res: express.Response) {
  const carts: Array<ICart> = req.body.carts;
  const {
    /* TODO: body: { couponCode },*/
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user,
  } = req;
  // validate carts array with cart validations
  for (const cart of carts) {
    const anyError = CartValidations.validate(cart).error;
    if (anyError) {
      return res.status(400).send(ValidationErrorResponse(anyError));
    }
  }

  // calculate total price of carts
  const totalPriceArray = [];
  for (const cart of carts) {
    const product: IProduct = await ProductSchema.findById(cart.productId);
    const price = Number(product.netPrice) * Number(cart.quantity);
    totalPriceArray.push(Number(price));
  }
  const totalPrice = totalPriceArray.reduce((acc, price) => acc + price, 0);

  // connect stripe and ask to info
  try {
    const stripe1 = new Stripe("sk_test_26PHem9AhJZvU623DfE1x4sd", {
      typescript: true,
      apiVersion: "2020-08-27",
    });
    const paymentIntent = await stripe1.paymentIntents.create({
      amount: totalPrice,
      currency: "eur",
      payment_method_types: [
        "giropay",
        "eps",
        "p24",
        "sofort",
        "sepa_debit",
        "card",
        "bancontact",
        "ideal",
      ],
    });
    // add order to database
    const orderHistory: IOrderHistory = {
      orderDate: new Date(),
      status: "paymentWaiting",
      user: user.userId,
      cargoNumber: null,
      statusExplanation: STATUS_EXPLAINATION.paymentWaiting,
      products: carts.map((cart) => {
        return {
          productId: cart.productId,
          quantity: cart.quantity,
          isReturned: false,
          size: cart.size,
          color: cart.color,
        };
      }),
      stripeSecretKey: paymentIntent.client_secret,
      totalPrice: totalPrice,
      paymentMethod: "credit-card",
    };

    const order = new OrderSchemas(orderHistory);
    const savedOrder = await order.save();
    // make user's cart empty
    const userCart = await UserSchema.findById(user.userId);
    userCart.carts = [];
    await userCart.save();
    return res.status(201).send(
      SuccessResponseWithCostumField(savedOrder, {
        stripeSecretKey: paymentIntent.client_secret,
      })
    );
  } catch (e: any) {
    return res.status(500).send(ErrorResponse(e));
  }
}

export async function changeOrderStatus(
  req: express.Request,
  res: express.Response
) {
  const {
    body: { orderId, status },
  } = req;

  if (!orderId || !status) {
    return res
      .status(400)
      .send(ErrorResponseWithMessage("orderId and status zorunludur."));
  }
  // check status is in the ORDER_STATUS list
  if (!ORDER_STATUS.includes(status)) {
    return res
      .status(400)
      .send(
        ErrorResponseWithMessage(
          "Status bilgisi hatalıdır:  " + ORDER_STATUS.join(",")
        )
      );
  }
  try {
    const order = await OrderSchemas.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .send(ErrorResponseWithMessage("Sipariş bulunamadı."));
    }
    order.status = status;
    order.statusExplanation = STATUS_EXPLAINATION[status];
    const savedOrder = await order.save();
    return res.status(201).send(SuccessResponse(savedOrder));
  } catch (e) {
    return res.status(500).send(ErrorResponse(e));
  }
}

export async function getOrderHistory(
  req: express.Request,
  res: express.Response
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { user } = req;
  try {
    const orders = await OrderSchemas.find({ user: user.userId }).sort(
      "-orderDate"
    );
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .send(ErrorResponseWithMessage("Sipariş bulunamadı."));
    }
    return res.status(200).send(SuccessResponse(orders));
  } catch (e) {
    return res.status(500).send(ErrorResponse(e));
  }
}

export async function makeSuccessOrder(
  req: express.Request,
  res: express.Response
) {
  const {
    body: { orderId },
  } = req;
  try {
    const order = await OrderSchemas.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .send(ErrorResponseWithMessage("Sipariş bulunamadı."));
    }
    order.status = "paymentSuccess";
    order.statusExplanation = STATUS_EXPLAINATION.paymentSuccess;
    const savedOrder = await order.save();

    // find product and update stock
    const productIds: Array<any> = [];
    savedOrder.products.forEach((product) => {
      const isAddedBefore = productIds.some(
        (x) => x === product.productId.toString()
      );
      if (!isAddedBefore) {
        productIds.push(product.productId.toString());
      }
    });

    const products = await ProductSchema.find({ _id: { $in: productIds } });

    products.forEach((product: IProduct) => {
      savedOrder.products.forEach((orderProduct: IOrder) => {
        if (product._id.toString() === orderProduct.productId.toString()) {
          product.stockStatus.forEach((stock) => {
            updateStock(stock, orderProduct);
          });
        }
      });
    });

    // update product stock
    for (const product of products) {
      await product.save();
    }

    return res.status(201).send(SuccessResponse(savedOrder));
  } catch (e) {
    console.error(e);
    return res.status(500).send(ErrorResponse(e));
  }
}

// admins

export async function getAllOrders(
  req: express.Request,
  res: express.Response
) {
  try {
    // get all orders
    const orders = await OrderSchemas.find();
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .send(ErrorResponseWithMessage("Sipariş bulunamadı."));
    }
    return res.status(200).send(SuccessResponse(orders));
  } catch (e) {
    return res.status(500).send(ErrorResponse(e));
  }
}

export async function addCargoNumber(
  req: express.Request,
  res: express.Response
) {
  const {
    body: { orderId, cargoNumber, cargoCompany },
  } = req;

  if (!orderId || !cargoNumber || !cargoCompany) {
    return res
      .status(400)
      .send(
        ErrorResponseWithMessage(
          "orderId, cargoNumber ve cargoCompany zorunludur."
        )
      );
  }
  try {
    const order = await OrderSchemas.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .send(ErrorResponseWithMessage("Sipariş bulunamadı."));
    }
    order.cargoNumber = cargoNumber;
    order.status = "inCargo";
    order.cargoCompany = cargoCompany;
    order.statusExplanation = STATUS_EXPLAINATION.inCargo;
    const savedOrder = await order.save();
    return res.status(200).send(SuccessResponse(savedOrder));
  } catch (e) {
    return res.status(500).send(ErrorResponse(e));
  }
}

function updateStock(product: IProductItem, cart: IOrder) {
  if (
    product.size === cart.size &&
    product.color.toString() === cart.color.toString()
  ) {
    product.quantity -= cart.quantity;
  }
}
