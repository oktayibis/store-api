import express from "express"
import jwt from "jsonwebtoken"
import { ErrorResponse } from "../utils/Helpers"

export default function CheckAdminTokenValid(req: express.Request, res: express.Response, next:express.NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send(ErrorResponse("Token bilgisi gelmedi"))
  }
  try {
   const token = authHeader.split(" ")[1] // take token from header
    const verifyToken = jwt.verify(token, process.env.SECRET)

    const { userId, role } = verifyToken as any;
    if (role !== "admin") {
      return res.status(401).send(ErrorResponse("Bu işlem için yetkiniz yok."))
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
    req.user = { userId, role };
    next()
 } catch (error) {
   return res.status(401).send(ErrorResponse("Token geçersiz, tekrar giriş yapınız"))
 }
}