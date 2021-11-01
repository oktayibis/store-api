import express from "express";
import { addToCart, deleteFromCart, getCart, updateCart } from "../controller/cart.controller";
import CheckUserTokenValid from "../middlewares/user.auth";

const router = express.Router();

router.route("/").get(CheckUserTokenValid, getCart);
router.route("/").post(CheckUserTokenValid, addToCart);
router.route("/:cartItemId").put(CheckUserTokenValid, updateCart);
router.route("/").delete(CheckUserTokenValid, deleteFromCart);



export default router;