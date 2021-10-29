import express from "express"
import { config } from "dotenv"
import routes from "./routes"
const app: express.Application = express()
config();

app.use(express.json());

app.use(routes)

app.listen(5100, () => {
  console.log("connect");
})