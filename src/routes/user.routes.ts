import express from "express"
import { getUser, login, register } from "../controller/user.controller";
import CheckUserTokenValid from "../middlewares/user.auth";

const router = express.Router();

router.route("/").get(CheckUserTokenValid,getUser)
router.route("/login").post(login)
router.route("/register").post(register)

export default router