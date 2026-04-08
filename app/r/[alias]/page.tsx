import { MongoClient } from "mongodb";
import { redirect, notFound } from "next/navigation";

const MONGO_URI = process.env.MONGO_URI as string;

export default async function Page({ params }: any) {
  const { alias } = await params; // 🔥 ВОТ ЭТО КЛЮЧ

  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db("url-shortener");
  const collection = db.collection("urls");

  const data = await collection.findOne({ alias });

  if (!data) {
    notFound();
  }

  redirect(data.originalUrl);
}