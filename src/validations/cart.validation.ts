import Joi from "joi";
import { SIZES } from "../utils/constants";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
Joi.objectId = require('joi-objectid')(Joi);

export const CartValidations = Joi.object({
  _id: Joi.string(),
  productId: Joi.objectId().required(),
  quantity: Joi.number().required(),
  size: Joi.string().required().valid(...SIZES)
}).meta({ className: "ICart" });