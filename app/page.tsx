"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CSPHeadersResponse {
  url?: string;
  cspHeaders?: Record<string, string>;
  message?: string;
  statusCode?: number;
  error?: string;
}

export default function Home() {
  const router = useRouter();
  const [embedToken, setEmbedToken] = useState("");
  const [domain, setDomain] = useState<"dev" | "prod" | "localhost">("dev");
  const [cspHeaders, setCspHeaders] = useState<CSPHeadersResponse | null>(null);
  const [loadingCsp, setLoadingCsp] = useState(false);

  const domains = {
    dev: "https://embed-proxy.doubletick.dev/",
    prod: "https://iframe.doubletick.io",
    localhost: "http://localhost:7777",
  };

  const iframeUrl = embedToken
    ? `${domains[domain]}?embed_token=${embedToken}`
    : "";

  const formatCSPHeader = (cspValue: string) => {
    // Split by semicolons and trim each directive
    const directives = cspValue
      .split(";")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    return directives.map((directive, index) => {
      const isFrameAncestors = directive
        .toLowerCase()
        .startsWith("frame-ancestors");
      
      return (
        <div key={index} className="flex items-start gap-2">
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          {isFrameAncestors ? (
            <span className="flex-1">
              <span className="rounded bg-yellow-100 px-1.5 py-0.5 font-semibold text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300">
                {directive.split(" ")[0]}
              </span>
              <span className="ml-1">{directive.substring(directive.indexOf(" ") + 1)}</span>
            </span>
          ) : (
            <span className="flex-1">{directive}</span>
          )}
        </div>
      );
    });
  };

  const fetchCSPHeaders = async () => {
    if (!iframeUrl) {
      alert("Please enter an embed token first");
      return;
    }

    setLoadingCsp(true);
    setCspHeaders(null);

    try {
      const response = await fetch("/api/csp-headers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: iframeUrl }),
      });

      const data = await response.json();
      setCspHeaders(data);
    } catch (error) {
      setCspHeaders({
        error: "Failed to fetch CSP headers",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoadingCsp(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="mb-6 w-full max-w-3xl">
        <button
          onClick={() => router.push("/create")}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Create
        </button>
      </div>
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

        {iframeUrl && (
          <div>
            <button
              onClick={fetchCSPHeaders}
              disabled={loadingCsp}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loadingCsp ? "Fetching..." : "Get CSP Headers"}
            </button>
          </div>
        )}

        {cspHeaders && (
          <div className="rounded-md border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              CSP Headers
            </h3>
            {cspHeaders.error ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                <p className="font-medium">Error: {cspHeaders.error}</p>
                {cspHeaders.message && (
                  <p className="mt-1 text-xs">{cspHeaders.message}</p>
                )}
              </div>
            ) : cspHeaders.message ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {cspHeaders.message}
              </p>
            ) : (
              <div className="space-y-2">
                {cspHeaders.url && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 word-wrap">
                    URL: <span className="break-all">{cspHeaders.url}</span>
                  </p>
                )}
                {cspHeaders.statusCode && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Status: {cspHeaders.statusCode}
                  </p>
                )}
                {cspHeaders.cspHeaders &&
                  Object.keys(cspHeaders.cspHeaders).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(cspHeaders.cspHeaders).map(
                        ([key, value]) => (
                          <div key={key} className="border-t border-zinc-200 pt-2 dark:border-zinc-700">
                            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              {key}:
                            </p>
                            <div className="mt-1 space-y-1 overflow-x-auto rounded bg-zinc-50 p-3 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                              {formatCSPHeader(value)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
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
