import express from "express";
import {
  changePassword,
  getUser,
  login,
  register,
  resetPasswordStep1,
  resetPasswordStep2,
} from "../controller/user.controller";
import CheckUserTokenValid from "../middlewares/user.auth";

const router = express.Router();

router.route("/").get(CheckUserTokenValid, getUser);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/reset-password").post(resetPasswordStep1);
router.route("/reset-password-confirm/").post(resetPasswordStep2);
router.route("/change-password").post(CheckUserTokenValid, changePassword);

export default router;
