import express from "express";
import CheckUserTokenValid from "../middlewares/user.auth";
import { addOrder, changeOrderStatus } from "../controller/order.controller";

const router = express.Router();
router.route("/payment").post(CheckUserTokenValid, addOrder);
router.route("/status").patch(CheckUserTokenValid, changeOrderStatus);
export default router;
