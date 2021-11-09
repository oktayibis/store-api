import Joi from "joi";
import { CartValidations } from "./cart.validation";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
Joi.objectId = require("joi-objectid")(Joi);

export const RegisterUser = Joi.object({
  _id: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().required().min(6),
  fullName: Joi.string().required(),
  birthDate: Joi.date(),
  sex: Joi.string(),
  lastLogin: Joi.date(),
  role: Joi.string(),
  carts: Joi.array().items(CartValidations),
  phone: Joi.string(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  orderHistory: Joi.array().items(Joi.objectId()),
}).meta({ className: "IRegisterUser" });

export const LoginUser = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().min(6),
}).meta({ className: "ILoginUser" });
