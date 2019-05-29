import * as express from "express";
import { Server } from "typescript-rest";
import { createConnection } from "typeorm";
import AuthController from "./controller/auth-controller";
import ArticleController from "./controller/article-controller";

async function main() {

  let app: express.Application = express();

  // Configure rest api
  Server.useIoC();
  Server.buildServices(app, AuthController);
  Server.buildServices(app, ArticleController);

  // Configure database connection
  await createConnection();

  app.listen(process.env.PORT || 3000, () => {
    console.log("Server up and running");
  });

}

main();