import express from "express";
import {
  ErrorResponse,
  ErrorResponseWithMessage,
  SuccessResponse,
} from "../utils/helpers";
import { ORDER_STATUS, PAYMENT_METHODS, SIZES } from "../utils/constants";
import ProductSchema from "../schemas/Product.schemas";

export async function getStatusTypes(
  req: express.Request,
  res: express.Response
) {
  try {
    return res.status(200).send(SuccessResponse(ORDER_STATUS));
  } catch (e) {
    return res.status(500).send(ErrorResponse(e));
  }
}

export async function getSizes(req: express.Request, res: express.Response) {
  try {
    return res.status(200).send(SuccessResponse(SIZES));
  } catch (e) {
    return res.status(500).send(ErrorResponse(e));
  }
}

export async function getPaymentsMethods(
  req: express.Request,
  res: express.Response
) {
  try {
    return res.status(200).send(SuccessResponse(PAYMENT_METHODS));
  } catch (e) {
    return res.status(500).send(ErrorResponse(e));
  }
}

export async function getCategories(
  req: express.Request,
  res: express.Response
) {
  try {
    const enumList = await ProductSchema.distinct("category");
    if (!enumList) {
      return res
        .status(500)
        .send(ErrorResponseWithMessage("Kategori bulunamadı."));
    }
    return res.status(200).send(SuccessResponse(enumList));
  } catch (e) {
    return res.status(500).send(ErrorResponse(e));
  }
}

export async function getMetas(req: express.Request, res: express.Response) {
  try {
    const metaList = await ProductSchema.distinct("metas");
    if (!metaList) {
      return res.status(500).send(ErrorResponseWithMessage("Meta bulunamadı."));
    }
    return res.status(200).send(SuccessResponse(metaList));
  } catch (e) {
    return res.status(500).send(ErrorResponse(e));
  }
}
