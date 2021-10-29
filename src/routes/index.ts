
import express from "express"
import products from "./product.routes"
import user from "./user.routes"

const app = express();
const apiPrefix  = "/api/v1"
app.use(apiPrefix + "/products", products)
app.use(apiPrefix + "/user", user)



export default app
