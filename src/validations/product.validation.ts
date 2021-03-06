/* eslint-disable @typescript-eslint/no-var-requires */
import Joi from "joi";
import { SIZES } from "../utils/constants";

export const ProductColorsValidation = Joi.object({
  _id: Joi.string(),
  name: Joi.string().required(),
  code: Joi.string().required().regex(/^#/).length(7),
}).meta({ className: "IProductColor" });

export const ProductStockItemValidation = Joi.object({
  _id: Joi.string(),
  color: Joi.string(),
  size: Joi.string().valid(...SIZES),
  quantity: Joi.number(),
}).meta({ className: "IProductItem" });

export const ProductValidation = Joi.object({
  _id: Joi.string(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  isDiscount: Joi.boolean().required(),
  discountAmount: Joi.number().required(),
  slug: Joi.string(),
  metas: Joi.array().items(Joi.string()).required(),
  netPrice: Joi.number(),
  rating: Joi.number(),
  featured: Joi.boolean().required(),
  category: Joi.array().items(Joi.string()).required(),
  stockStatus: Joi.array().items(ProductStockItemValidation),
}).meta({ className: "IProduct" });
