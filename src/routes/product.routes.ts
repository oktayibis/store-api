import express from "express"
import { getAllProducts } from "../controller/product.controller";

const router = express.Router();

router.route("/").get(getAllProducts)

export default router