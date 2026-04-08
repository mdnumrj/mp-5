import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI as string;

export async function POST(req: Request) {
  const { alias, originalUrl } = await req.json();

  const cleanAlias = alias.trim();
  const cleanUrl = originalUrl.trim();

  try {
    new URL(cleanUrl);
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db("url-shortener");
  const collection = db.collection("urls");

  const existing = await collection.findOne({ alias: cleanAlias });
  if (existing) {
    return Response.json({ error: "Alias already exists" }, { status: 400 });
  }

  const res = await collection.insertOne({
    alias: cleanAlias,
    originalUrl: cleanUrl,
  });

  return Response.json({
    id: res.insertedId.toString(),
    alias: cleanAlias,
    originalUrl: cleanUrl,
  });
}