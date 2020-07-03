import { MongoClient } from "mongodb";

const url = process.env.MONGO_URL || "";
const collectionName = "registrations";

export async function getCollection() {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const collection = client.db().collection(collectionName);
  collection.createIndex({ token: 1, account: 1 }, { unique: true });
  collection.createIndex({ token: 1, rewarded: 1 });
  return collection;
}
