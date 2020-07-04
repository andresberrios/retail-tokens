import { ObjectID, Collection } from "mongodb";
import Router from "koa-router";
import { validateIdentity, isTokenIssuer } from "./idproof";

export function loadRoutes(router: Router, collection: Collection) {
  router.post("/registrations/:token/pending", async ctx => {
    const {
      transaction,
      signature
    }: { transaction?: number[]; signature?: string } = ctx.request.body || {};
    if (!transaction || !signature) {
      return (ctx.response.status = 400);
    }
    const auth = await validateIdentity(
      Uint8Array.from(transaction),
      signature
    );
    if (await isTokenIssuer(auth.actor, ctx.params.token)) {
      ctx.body = await collection
        .find({ token: ctx.params.token, rewarded: { $ne: true } })
        .toArray();
    } else {
      ctx.response.status = 401;
    }
  });

  router.post("/registrations", async ctx => {
    // TODO Check if token and account exist in the blockchain
    // Also handle duplicates with a proper error so the client can tell it's a duplicate
    const result = await collection.insertOne({
      _id: new ObjectID().toHexString(),
      token: ctx.request.body.token,
      account: ctx.request.body.account,
      email: ctx.request.body.email
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
