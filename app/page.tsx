"use client";

import { useState } from "react";

export default function Home() {
  const [alias, setAlias] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    setError("");
    setResult("");

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({
        alias,
        originalUrl: url,
      }),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    setResult(`/r/${data.alias}`);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>URL Shortener</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <br /><br />

        <button type="submit">Create</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <p>
          Short URL: <a href={result}>{result}</a>
        </p>
      )}
    </div>
  );
}