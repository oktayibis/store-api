import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../schemas/User.schemas";
import { ErrorResponse, ErrorResponseWithMessage, SuccessResponse, SuccessResponseWithCostumField, ValidationErrorResponse } from "../utils/Helpers";
import { RegisterUser, LoginUser } from "../validations/user.validation";
import { IRegisterUser } from "../Interfaces/user.validation";


export async function getUser(req: express.Request, res:express.Response) {

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
    const { user } = req;
    const registeredUser = await User.findById(user.userId)

    // if user not found
    if (!registeredUser) {
    return res.status(404).send(ErrorResponseWithMessage("Kullanıcı bilgilerine ulaşılamadı."))
    }
    
    res.status(200).send(SuccessResponse(registeredUser.toObject()))

  } catch (error:any) {
      return res.status(500).send(ErrorResponse(error))
  }
}

export async function register(req:express.Request, res:express.Response) {
  const { body } = req;
  const anyError = RegisterUser.validate(body).error
  if (anyError) {
    return res.status(500).send(ValidationErrorResponse(anyError))
  }

  try {
    const isRegisteredBefore = await User.exists({ email: body.email });

    if (isRegisteredBefore) {
      return res.status(406).send(ErrorResponseWithMessage("Bu email daha zaten kayıtlıdır.", 406))
    }

    const salt = await bcrypt.genSalt(Number(process.env.HASH))
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const user = new User({...body, password:hashedPassword})
    const createdUser = await user.save()
    const responseUser = createdUser.toObject();
    return res.status(201).send(SuccessResponse(responseUser))
    
  } catch (error:any) {
    return res.status(500).send(ErrorResponse(error))
  }

}

export async function login(req:express.Request, res:express.Response) {
  const { body } = req;
  const anyError = LoginUser.validate(body).error
  if (anyError) {
    return res.status(400).send(ValidationErrorResponse(anyError))
  }

  try {
    // first find user by email
    const registeredUser: IRegisterUser = await User.findOne({ email: body.email }) as any
    
    if (!registeredUser) {
      return res.status(404).send(ErrorResponseWithMessage("Kullanıcı bulunamadı."))
    }

    const isPasswordCorrect = await bcrypt.compare(body.password, registeredUser.password);
    if (!isPasswordCorrect) {
      return res.status(404).send(ErrorResponseWithMessage("Şifre hatalı"))
    }
    // login success now and creating token
    const token = jwt.sign({ userId: registeredUser._id, role: registeredUser.role }, process.env.SECRET as string, { expiresIn: "1h" });
    
    registeredUser.lastLogin = new Date();
    const updatedUser = await User.findByIdAndUpdate(registeredUser._id, registeredUser, {new:true})
    return res.status(200).send(SuccessResponseWithCostumField(updatedUser.toObject(), {token}))
    
  } catch (error:any) {
    return res.status(500).send(ErrorResponse(error))
  }
}


export async function changePassword(req:express.Request, res:express.Response) {
  const { body } = req;

  return res.send(body)
}

