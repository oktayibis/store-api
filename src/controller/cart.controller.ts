import express from "express";
import { CartValidations } from "../validations/cart.validation";
import {
  ErrorResponse,
  ErrorResponseWithMessage,
  SuccessResponse,
  ValidationErrorResponse,
} from "../utils/helpers";
import UserSchemas from "../schemas/User.schemas";
import { IRegisterUser } from "../Interfaces";

export async function addToCart(req: express.Request, res: express.Response) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { body, user } = req;
  const anyError = CartValidations.validate(body).error;
  if (anyError) {
    return res.status(400).send(ValidationErrorResponse(anyError));
  }
  try {
    const foundUser = await UserSchemas.findById(user.userId);
    if (!foundUser) {
      return res
        .status(404)
        .send(ErrorResponseWithMessage("Kullanıcı bulunamadı"));
    }

    const mutatedUser: IRegisterUser = foundUser.toObject() as any;
    const isDuplicated = mutatedUser?.carts?.find(
      (x) => x.productId?.toString() === body.productId && x.size === body.size
    );

    if (isDuplicated) {
      isDuplicated.quantity += body.quantity;
    } else {
      mutatedUser.carts?.push(body);
    }
    const updateStatus = await foundUser.updateOne(mutatedUser);
    if (!updateStatus.acknowledged)
      return res
        .status(500)
        .send(ErrorResponseWithMessage("Sepet güncellenemedi"));
    return res.status(201).send(SuccessResponse(mutatedUser.carts));
  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}

export async function deleteFromCart(
  req: express.Request,
  res: express.Response
) {
  const {
    body: { cartItemId },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user,
  } = req;

  try {
    const foundUser = await UserSchemas.findById(user.userId);
    if (!foundUser)
      return res
        .status(400)
        .send(ErrorResponseWithMessage("Kullanıcı bulunamadı."));

    const firstLength = foundUser.carts?.length;
    foundUser.carts = foundUser.carts?.filter(
      (c) => c._id?.toString() !== cartItemId
    );

    if (firstLength === foundUser.carts?.length)
      return res
        .status(403)
        .send(ErrorResponseWithMessage("Sepette ürün bulunamadı."));

    const updateStatus = await foundUser.updateOne(foundUser.toObject());
    if (!updateStatus.acknowledged)
      return res
        .status(500)
        .send(ErrorResponseWithMessage("Sepet güncellenemedi"));
    return res.status(200).send(SuccessResponse(foundUser.carts));
  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}

export async function updateCart(req: express.Request, res: express.Response) {
  const {
    params: { cartItemId },
    body,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user,
  } = req;

  const anyError = CartValidations.validate(body).error;
  if (anyError) return res.status(400).send(ValidationErrorResponse(anyError));

  try {
    const foundUser = await UserSchemas.findById(user.userId);
    if (!foundUser)
      return res
        .status(400)
        .send(ErrorResponseWithMessage("Kullanıcı bulunamadı."));
    foundUser.carts?.forEach((cart) => {
      if (cart._id?.toString() === cartItemId) {
        cart.productId = body.productId;
        cart.quantity = body.quantity;
        cart.size = body.size;
        console.log(cart);
      }
    });
    const updatedCartUser = await UserSchemas.findByIdAndUpdate(
      user.userId,
      foundUser.toObject(),
      { new: true }
    ).select("carts");
    return res.status(200).send(SuccessResponse(updatedCartUser));
  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}

export async function getCart(req: express.Request, res: express.Response) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { user } = req;

  try {
    const cartList = await UserSchemas.findById(user.userId).select("carts");
    if (!cartList) {
      return res
        .status(404)
        .send(ErrorResponseWithMessage("Kullanıcı bulunamadı."));
    }

    return res.status(200).send(SuccessResponse(cartList));
  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}
