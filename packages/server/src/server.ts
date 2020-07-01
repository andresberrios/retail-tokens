import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import cors from "@koa/cors";
import { loadRoutes } from "./routes";
import { getCollection } from "./collection";

const app = new Koa();
const router = new Router();
const port = process.env.PORT;

// eslint-disable-next-line @typescript-eslint/no-use-before-define
main().catch(error => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const collection = await getCollection();
  loadRoutes(router, collection);

  app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
