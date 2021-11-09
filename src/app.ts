import express from "express";
import { config } from "dotenv";
import routes from "./routes";
import connect from "./loaders/db";
const app: express.Application = express();
config();

app.use(express.json());

app.use(routes);

async function startServer() {
  try {
    await connect(process.env.DB_URI as string);

    app.listen(process.env.PORT, () => {
      console.log(`Server Running Port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

startServer()
  .then(() => console.log("Connection Start"))
  .catch((e) => console.log("Hata Alındı..", e));
