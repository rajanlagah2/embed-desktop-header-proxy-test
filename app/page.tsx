"use client";
import { useState } from "react";

export default function Home() {
  const [embedToken, setEmbedToken] = useState("");
  const [domain, setDomain] = useState<"dev" | "prod" | "localhost">("dev");

  const domains = {
    dev: "https://embed-proxy.doubletick.dev/",
    prod: "https://iframe.doubletick.io",
    localhost: "http://localhost:7777",
  };

  const iframeUrl = embedToken
    ? `${domains[domain]}?embed_token=${embedToken}`
    : "";

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="w-full max-w-3xl space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Domain
          </label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="domain"
                value="dev"
                checked={domain === "dev"}
                onChange={(e) => setDomain(e.target.value as "dev" | "prod" | "localhost")}
                className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 dark:text-zinc-400"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Dev
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="domain"
                value="prod"
                checked={domain === "prod"}
                onChange={(e) => setDomain(e.target.value as "dev" | "prod" | "localhost")}
                className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 dark:text-zinc-400"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Prod
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="domain"
                value="localhost"
                checked={domain === "localhost"}
                onChange={(e) => setDomain(e.target.value as "dev" | "prod" | "localhost")}
                className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 dark:text-zinc-400"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Localhost
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Embed Token
          </label>
          <input
            type="text"
            value={embedToken}
            onChange={(e) => setEmbedToken(e.target.value)}
            placeholder="Enter embed token"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="mt-6 flex h-full w-full max-w-5xl flex-1">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            title="Embedded content"
            className="h-[70vh] w-full rounded-md border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        ) : (
          <div className="flex h-[70vh] w-full items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            Enter an embed token above to load it here.
          </div>
        )}
      </div>
    </div>
  );
}
