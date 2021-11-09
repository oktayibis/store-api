import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../schemas/User.schemas";
import { ErrorResponse, ErrorResponseWithMessage, SuccessResponse, SuccessResponseWithCostumField, ValidationErrorResponse } from "../utils/helpers";
import { RegisterUser, LoginUser } from "../validations/user.validation";
import ResetPassword from "../schemas/ResetPassword";

export async function getUser(req: express.Request, res: express.Response) {

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = req;
    const registeredUser = await User.findById(user.userId).select("-password");

    // if user not found
    if (!registeredUser) {
      return res.status(404).send(ErrorResponseWithMessage("Kullanıcı bilgilerine ulaşılamadı."));
    }

    res.status(200).send(SuccessResponse(registeredUser));

  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}

export async function register(req: express.Request, res: express.Response) {
  const { body } = req;
  const anyError = RegisterUser.validate(body).error;
  if (anyError) {
    return res.status(500).send(ValidationErrorResponse(anyError));
  }

  try {
    const isRegisteredBefore = await User.exists({ email: body.email });

    if (isRegisteredBefore) {
      return res.status(406).send(ErrorResponseWithMessage("Bu email daha zaten kayıtlıdır.", 406));
    }

    const salt = await bcrypt.genSalt(Number(process.env.HASH));
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const user = new User({ ...body, password: hashedPassword });
    const createdUser = await user.save();
    const responseUser = createdUser.toObject();
    return res.status(201).send(SuccessResponse(responseUser));

  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }

}

export async function login(req: express.Request, res: express.Response) {
  const { body } = req;
  const anyError = LoginUser.validate(body).error;
  if (anyError) {
    return res.status(400).send(ValidationErrorResponse(anyError));
  }

  try {
    // first find user by email
    const registeredUser = await User.findOne({ email: body.email }).select("+password") as any;
    if (!registeredUser) {
      return res.status(404).send(ErrorResponseWithMessage("Kullanıcı bulunamadı."));
    }

    const isPasswordCorrect = await bcrypt.compare(body.password, registeredUser.password);
    if (!isPasswordCorrect) {
      return res.status(404).send(ErrorResponseWithMessage("Şifre hatalı"));
    }
    // login success now and creating token
    const token = jwt.sign({ userId: registeredUser._id, role: registeredUser.role }, process.env.SECRET as string, { expiresIn: "1h" });

    registeredUser.lastLogin = new Date();
    const response = await registeredUser.updateOne(registeredUser)
  if(response.acknowledged === false) {
      return res.status(500).send(ErrorResponseWithMessage("Kullanıcı Güncellemesi başarısız."));
  }
    return res.status(200).send(SuccessResponseWithCostumField(registeredUser.toObject(), { token }));

  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}


export async function resetPasswordStep1(req: express.Request, res: express.Response) {

  const { body: {email} } = req;
  if( !email) {
      return res.status(400).send(ErrorResponseWithMessage("Eksik Bilgi Gönderildi"))
  }

  const foundUser = await User.exists({email:email});
  if(!foundUser) return res.status(404).send(ErrorResponseWithMessage("Kullanıcı bulunamadı."));

  // send change password email
    const resetCode=Math.floor(Math.random() * (999999 - 100000) + 100000).toString()

    const resetPassword =  await ResetPassword.findOne({email:email});
    if(!resetPassword) {
        const resetPassword = new ResetPassword({email:email, resetCode:resetCode});
         await resetPassword.save();
    } else {
        const response =  await resetPassword.updateOne({resetCode:resetCode});
        if(!response.acknowledged) {
            return res.status(500).send(ErrorResponseWithMessage("Şifre Sıfırlama Kodu Güncellenemedi."));
        }
    }
    return res.status(200).send(SuccessResponse({resetCode},"Şifre sıfırlama kodu gönderildi."));

}

export async function resetPasswordStep2(req:express.Request, res:express.Response) {
    const {body: {resetCode,password, email}} = req;
    if(!resetCode || !password|| !email) {
        return res.status(400).send(ErrorResponseWithMessage("Eksik Bilgi Gönderildi"))
    }
   try {
       // find user by email
       const foundUser = await User.findOne({email:email}).select("+password");
       if(!foundUser) return res.status(404).send(ErrorResponseWithMessage("Kullanıcı bulunamadı."));

       // find resetPassword by email
       const resetPassword = await ResetPassword.findOne({email:email});
       if(!resetPassword) return res.status(404).send(ErrorResponseWithMessage("Şifre Sıfırlama Kodu Bulunamadı."));

       // check resetCode
       if(resetPassword.resetCode !== resetCode) return res.status(404).send(ErrorResponseWithMessage("Şifre Sıfırlama Kodu Hatalı."));

       // check resetCode expire
       const now = new Date();
       const expireDate = new Date(resetPassword.createdAt);
       expireDate.setMinutes(expireDate.getMinutes() + 10);
       if(now > expireDate) return res.status(500).send(ErrorResponseWithMessage("Şifre Sıfırlama Kodu Geçerli Değil."));

       // update password
       const salt = await bcrypt.genSalt(Number(process.env.HASH));
       const hashedPassword = await bcrypt.hash(password, salt);
       const response = await foundUser.updateOne({password:hashedPassword});
       if(!response.acknowledged) return res.status(500).send(ErrorResponseWithMessage("Şifre Güncellenemedi."));

       // delete resetPassword
       const response2 = await resetPassword.remove();

       if(!response2) return res.status(500).send(ErrorResponseWithMessage("Şifre Sıfırlama Kodu Silinemedi."));
       return res.status(200).send(SuccessResponse({},"Şifre Güncellendi."));
   }catch (e) {
       return res.status(500).send(ErrorResponse(e));
   }


}

export async function changePassword(req:express.Request, res:express.Response) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {body: {password, newPassword}, user} = req;
    if(!password || !newPassword) {
        return res.status(400).send(ErrorResponseWithMessage("Eksik Bilgi Gönderildi"))
    }
    try {
        // find user by email
        const foundUser = await User.findById(user.userId).select("+password");
        if(!foundUser) return res.status(404).send(ErrorResponseWithMessage("Kullanıcı bulunamadı."));

        // check password
        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
        if(!isPasswordCorrect) return res.status(404).send(ErrorResponseWithMessage("Şifre Hatalı."));

        // update password
        const salt = await bcrypt.genSalt(Number(process.env.HASH));
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const response = await foundUser.updateOne({password:hashedPassword});
        if(!response.acknowledged) return res.status(500).send(ErrorResponseWithMessage("Şifre Güncellenemedi."));

        return res.status(200).send(SuccessResponse({},"Şifre Güncellendi."));
}
    catch (e) {
    return res.status(500).send(ErrorResponse(e));
}
}

