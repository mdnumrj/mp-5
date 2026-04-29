import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";

export default async function AliasPage({
  params,
}: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await params;
  const db = await getDb();
  const entry = await db.collection("links").findOne({ alias });

  if (!entry) {
    return (
      <main style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>404 - Link not found</h1>
        <a href="/">Go back home</a>
      </main>
    );
  }

  redirect(entry.url);
}