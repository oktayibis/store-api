import express from "express";
import CheckUserTokenValid from "../middlewares/user.auth";
import {
  addOrder,
  changeOrderStatus,
  getAllOrders,
  getOrderHistory,
  makeSuccessOrder,
} from "../controller/order.controller";
import CheckAdminTokenValid from "../middlewares/admin.auth";

const router = express.Router();
router.route("/payment").post(CheckUserTokenValid, addOrder);
router.route("/status").put(CheckUserTokenValid, changeOrderStatus);
router.route("/payment-success").post(CheckUserTokenValid, makeSuccessOrder);
router.route("/").get(CheckUserTokenValid, getOrderHistory);
router.route("/all").get(CheckAdminTokenValid, getAllOrders);
export default router;
