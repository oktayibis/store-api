import express from "express"
import { getAllProducts, addProduct , deleteProductWithId , updateProductWithId
} from "../controller/product.controller";

const router = express.Router();

router.route("/").get(getAllProducts)
router.route("/add").post(addProduct)
router.route("/:productId").delete(deleteProductWithId)
router.route("/:productId").put(updateProductWithId)

export default router