import express from "express"
import { getUser } from "../controller/user.controller";

const router = express.Router();

router.route("/").get(getUser)

export default router