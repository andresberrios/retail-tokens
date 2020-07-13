import { ObjectID, Collection } from "mongodb";
import Router from "koa-router";
import { ParameterizedContext, Next } from "koa";
import {
  validateIdentity,
  accountExists,
  tokenExists,
  getTokenStats
} from "./idproof";

async function authGuard(
  ctx: ParameterizedContext<unknown, Router.IRouterParamContext<unknown, {}>>,
  next: Next
) {
  const {
    transaction,
    signature
  }: { transaction?: number[]; signature?: string } =
    (ctx.request.body && ctx.request.body.proof) || {};
  if (!transaction || !signature) {
    return (ctx.response.status = 400);
  }
  if (!ctx.params.token) {
    return (ctx.response.status = 400);
  }
  const stats = await getTokenStats(ctx.params.token);
  if (!stats) {
    return (ctx.response.status = 400);
  }
  let auth;
  try {
    auth = await validateIdentity(Uint8Array.from(transaction), signature);
  } catch (error) {
    return (ctx.response.status = 400);
  }
  if (auth.actor !== stats.issuer) {
    return (ctx.response.status = 401);
  }
  await next();
}

export function loadRoutes(router: Router, collection: Collection) {
  router.post("/registrations/pending/:token", authGuard, async ctx => {
    const filter = {
      token: ctx.params.token,
      rewardedAt: null
    };
    const cursor = collection
      .find({
        ...filter,
        _id: ctx.body.cursor ? { $lt: ctx.body.cursor } : undefined
      })
      .limit(ctx.body.limit || 100)
      .sort("_id", -1);
    const [total, remaining, rows] = await Promise.all([
      collection.find(filter).count(),
      cursor.count(),
      cursor.toArray()
    ]);
    ctx.body = {
      more: rows.length < remaining,
      cursor: rows[rows.length - 1]._id,
      rows,
      total
    };
  });

  router.post("/registrations/rewarded/:token", authGuard, async ctx => {
    const filter = {
      token: ctx.params.token,
      rewardedAt: { $ne: null }
    };
    const cursor = collection
      .find({
        ...filter,
        rewardedAt: ctx.body.cursor
          ? { $lt: ctx.body.cursor }
          : filter.rewardedAt
      })
      .limit(ctx.body.limit || 100)
      .sort("rewardedAt", -1);
    const [total, remaining, rows] = await Promise.all([
      collection.find(filter).count(),
      cursor.count(),
      cursor.toArray()
    ]);
    ctx.body = {
      more: rows.length < remaining,
      cursor: rows[rows.length - 1].rewardedAt,
      rows,
      total
    };
  });

  router.post("/registrations", async ctx => {
    let token = ctx.request.body.token;
    const {
      account,
      email
    }: { token?: string; account?: string; email?: string } = ctx.request.body;
    if (
      typeof token !== "string" ||
      typeof account !== "string" ||
      typeof email !== "string"
    ) {
      return (ctx.response.status = 400);
    }
    token = token.toUpperCase();
    const [accountValid, tokenValid] = await Promise.all([
      accountExists(account),
      tokenExists(token)
    ]);
    if (!tokenValid) {
      return (ctx.response.status = 400);
    }
    if (!accountValid) {
      ctx.body = { code: "INVALID_ACCOUNT" };
      return (ctx.response.status = 400);
    }
    try {
      const result = await collection.insertOne({
        _id: new ObjectID().toHexString(),
        token,
        account,
        email,
        rewardedAt: null
      });
      ctx.body = result.ops[0];
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        ctx.response.status = 400;
        ctx.body = { code: "DUPLICATE_ENTRY" };
      }
    }
  });

  router.put("/registrations/:id/rewarded", async ctx => {
    const result = await collection.findOneAndUpdate(
      { _id: ctx.params.id },
      { $set: { rewardedAt: new Date().toISOString() } },
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
