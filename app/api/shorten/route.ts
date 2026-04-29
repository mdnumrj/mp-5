import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { url, alias } = await request.json();

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (!alias || alias.trim() === "") {
      return NextResponse.json({ error: "Alias is required" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("links");

    const existing = await collection.findOne({ alias });
    if (existing) {
      return NextResponse.json({ error: "This alias is already taken" }, { status: 409 });
    }

    await collection.insertOne({ url, alias, createdAt: new Date() });
    return NextResponse.json({ success: true });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}