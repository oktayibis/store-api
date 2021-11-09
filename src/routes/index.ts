import express from "express";
import products from "./product.routes";
import user from "./user.routes";
import colors from "./colors.routes";
import cart from "./cart.routes";
import order from "./order.routes";
const app = express();
const apiPrefix = "/api/v1";
app.use(apiPrefix + "/products", products);
app.use(apiPrefix + "/user", user);
app.use(apiPrefix + "/colors", colors);
app.use(apiPrefix + "/cart", cart);
app.use(apiPrefix + "/order", order);

export default app;
