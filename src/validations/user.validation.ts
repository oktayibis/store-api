import Joi from "joi"

export const RegisterUser = Joi.object({
  _id:Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().required().min(6),
  fullName: Joi.string().required(),
  birthDate: Joi.date(),
  sex: Joi.string(),
  lastLogin: Joi.date(),
  role: Joi.string(),
  carts: Joi.array().items(Joi.string()),
  phone:Joi.string()
}).meta({className:"IRegisterUser"})

export const LoginUser = Joi.object({
  email: Joi.string().required(),
  password:Joi.string().required().min(6)
}).meta({className:"ILoginUser"})