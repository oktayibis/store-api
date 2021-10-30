import express from "express"
import { getAllProducts, addProduct , deleteProductWithId, getProductById, getProductBySlug, updateProduct 
} from "../controller/product.controller";

const router = express.Router();

router.route("/").get(getAllProducts)
router.route("/add").post(addProduct)
router.route("/:productId").get(getProductById)
router.route("/:productId").put(updateProduct)
router.route("/slug/:slug").get(getProductBySlug)
router.route("/:productId").delete(deleteProductWithId)

export default router