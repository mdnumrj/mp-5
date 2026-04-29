"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alias }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setShortUrl(`${window.location.origin}/${alias}`);
      setUrl("");
      setAlias("");
    } catch {
      setError("Server error");
    }

    setLoading(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5"
    }}>
      <div style={{
        background: "white",
        padding: 32,
        width: "100%",
        maxWidth: 420,
        border: "1px solid #ddd"
      }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 26 }}>URL Shortener</h1>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Paste a long link, give it a short name.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              fontSize: 14
            }}
          />

          <input
            type="text"
            placeholder="alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              fontSize: 14
            }}
          />

          {error && (
            <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 10,
              padding: 12,
              background: "#111",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {shortUrl && (
          <div style={{
            marginTop: 20,
            padding: 12,
            border: "1px solid #000"
          }}>
            <p style={{ fontSize: 13, marginBottom: 6 }}>
              Short URL:
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ flex: 1, fontSize: 13, wordBreak: "break-all" }}>
                {shortUrl}
              </span>

              <button
                onClick={handleCopy}
                style={{
                  padding: "6px 10px",
                  background: "#000",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}