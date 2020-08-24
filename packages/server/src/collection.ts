import { MongoClient } from "mongodb";

const url = process.env.MONGO_URL || "";
const collectionName = "registrations";

export async function getCollection() {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const collection = client.db().collection(collectionName);
  collection.createIndex(
    { token: 1, account: 1 },
    { unique: true, background: true }
  );
  collection.createIndex(
    { token: 1, rewardedAt: -1, _id: -1 },
    { background: true }
  );
  return collection;
}
