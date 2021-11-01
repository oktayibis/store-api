import express from "express";
import jwt from "jsonwebtoken";
import { ErrorResponse, ErrorResponseWithMessage } from "../utils/helpers";

export default function CheckUserTokenValid(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send(ErrorResponseWithMessage("Token bilgisi gelmedi", 400));
  }
  try {
    const token = authHeader.split(" ")[1]; // take token from header
    const verifyToken = jwt.verify(token, process.env.SECRET as string);

    const { userId, role } = verifyToken as any;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.user = { userId, role };

    next();
  } catch (error) {
    return res.status(401).send(ErrorResponseWithMessage("Token geçersiz, tekrar giriş yapınız", 400));
  }
}

