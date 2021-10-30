import express from "express"
import { ValidationErrorResponse } from "../utils/helpers";
import { ProductColorsValidation } from "../validations/product.validation";

export async function addColor(req:express.Request, res:express.Response) {
  const { body } = req;

  const anyError = ProductColorsValidation.validate(body).error;

  if (anyError) {
    return res.status(400).send(ValidationErrorResponse(anyError))
  }

  try {
    
  } catch (error) {
    
  }
}