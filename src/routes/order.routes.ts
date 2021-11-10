import express from "express";
import CheckUserTokenValid from "../middlewares/user.auth";
import {
  addCargoNumber,
  addOrder,
  changeOrderStatus,
  getAllOrders,
  getOrderHistory,
  makeSuccessOrder,
} from "../controller/order.controller";
import CheckAdminTokenValid from "../middlewares/admin.auth";

const router = express.Router();
router.route("/").get(CheckUserTokenValid, getOrderHistory);
router.route("/payment").post(CheckUserTokenValid, addOrder);
router.route("/status").put(CheckUserTokenValid, changeOrderStatus);
router.route("/payment-success").post(CheckUserTokenValid, makeSuccessOrder);

// admin routes
router.route("/all").get(CheckAdminTokenValid, getAllOrders);
router.route("/cargo").post(CheckAdminTokenValid, addCargoNumber);

export default router;
