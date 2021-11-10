import Joi from "joi";
import { ORDER_STATUS, SIZES, PAYMENT_METHODS } from "../utils/constants";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
Joi.objectId = require("joi-objectid")(Joi);

export const OrderValidation = Joi.object({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  productId: Joi.objectId().required(),
  quantity: Joi.number().required(),
  size: Joi.string()
    .valid(...SIZES)
    .required(),
  isReturned: Joi.boolean().required(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  color: Joi.objectId().required(),
}).meta({ className: "IOrder" });

export const OrderHistoryValidation = Joi.object({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  user: Joi.objectId(),
  products: Joi.array().items(OrderValidation),
  stripeSecretKey: Joi.string().required(),
  cargoNumber: Joi.string(),
  cargoCompany: Joi.string(),
  orderDate: Joi.date().required(),
  status: Joi.string()
    .valid(...ORDER_STATUS)
    .required(),
  statusExplanation: Joi.string(),
  totalPrice: Joi.number().required(),
  paymentMethod: Joi.string()
    .valid(...PAYMENT_METHODS)
    .required(),
}).meta({ className: "IOrderHistory" });
