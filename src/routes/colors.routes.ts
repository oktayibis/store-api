import express from "express";
import {
  addColor,
  deleteColor,
  getColors,
  updateColor,
} from "../controller/colors.controller";

const router = express.Router();

router.route("/").get(getColors);
router.route("/add").post(addColor);
router.route("/:colorId").delete(deleteColor);
router.route("/:colorId").put(updateColor);

export default router;
