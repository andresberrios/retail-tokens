import { ObjectID, Collection } from "mongodb";
import Router from "koa-router";

export function loadRoutes(router: Router, collection: Collection) {
  router.get("/registrations", async ctx => {
    ctx.body = await collection.find().toArray();
  });

  router.get("/registrations/:token", async ctx => {
    ctx.body = await collection.find({ token: ctx.params.token }).toArray();
  });

  router.get("/registrations/:token/pending", async ctx => {
    ctx.body = await collection
      .find({ token: ctx.params.token, rewarded: { $ne: true } })
      .toArray();
  });

  router.post("/registrations", async ctx => {
    const result = await collection.insertOne({
      _id: new ObjectID().toHexString(),
      token: ctx.request.body.token,
      email: ctx.request.body.email,
      account: ctx.request.body.account
    });
    ctx.body = result.ops[0];
  });

  router.put("/registrations/:id/rewarded", async ctx => {
    const result = await collection.findOneAndUpdate(
      { _id: ctx.params.id },
      { $set: { rewarded: true } },
      { returnOriginal: false }
    );
    if (result.value) {
      ctx.response.status = 200;
      ctx.body = result.value;
    } else {
      ctx.response.status = 404;
    }
  });
}
