import express from "express";
import {
  getCategories,
  getMetas,
  getPaymentsMethods,
  getSizes,
  getStatusTypes,
} from "../controller/enums.controller";

const router = express.Router();

router.route("/sizes").get(getSizes);
router.route("/payments").get(getPaymentsMethods);
router.route("/status").get(getStatusTypes);
router.route("/categories").get(getCategories);
router.route("/metas").get(getMetas);
export default router;
