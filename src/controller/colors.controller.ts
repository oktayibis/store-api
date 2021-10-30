import express from "express";
import ColorSchemas from "../schemas/Color.schemas";
import { ErrorResponse, ErrorResponseWithMessage, SuccessResponse, ValidationErrorResponse } from "../utils/helpers";
import { ProductColorsValidation } from "../validations/product.validation";

export async function addColor(req: express.Request, res: express.Response) {
  const { body } = req;

  const anyError = ProductColorsValidation.validate(body).error;

  if (anyError) {
    return res.status(400).send(ValidationErrorResponse(anyError));
  }

  try {
    const isExisit = await ColorSchemas.findOne({ code: body.code });

    if (isExisit) {
      return res.status(400).send(ErrorResponseWithMessage("Bu renk daha önce eklenmiş", 400));
    }
    const newColor = new ColorSchemas(body);
    const savedColor = await newColor.save();

    return res.status(201).send(SuccessResponse(savedColor));

  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}

export async function getColors(req: express.Request, res: express.Response) {
  try {
    const list = await ColorSchemas.find({});
    if (!list || list.length === 0) {
      return res.status(404).send(ErrorResponseWithMessage("Renk bulunamadı."));
    }
    return res.status(200).send(SuccessResponse(list));
  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}

export async function deleteColor(req: express.Request, res: express.Response) {
  const { params: { colorId } } = req;
  if (!colorId) {
    return res.status(400).send(ErrorResponseWithMessage("Lütfen renk ID bilgisini geçiniz."));
  }

  try {
    const deletedItem =  await ColorSchemas.findByIdAndDelete(colorId);
    if (!deletedItem) {
      return res.status(404).send(ErrorResponseWithMessage("Silenecek renk bulunamadı."));
    }
    return res.status(200).send(SuccessResponse(deletedItem));

  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));

  }
}


export async function updateColor(req: express.Request, res:express.Response) {
  const { body, params: { colorId } } = req;

  const anyError = ProductColorsValidation.validate(body).error
  if (anyError) {
    return res.status(400).send(ValidationErrorResponse(anyError))
  }

  try {
    const color = await ColorSchemas.findByIdAndUpdate(colorId, body, { new: true })
    return res.status(200).send(SuccessResponse(color))
    
  } catch (error:any) {
     return res.status(500).send(ErrorResponse(error));
  }   

}