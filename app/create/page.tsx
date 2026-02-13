"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const [jwtSecret, setJwtSecret] = useState("");
  const [origins, setOrigins] = useState<string[]>([""]);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addOrigin = () => {
    setOrigins([...origins, ""]);
  };

  const updateOrigin = (index: number, value: string) => {
    const newOrigins = [...origins];
    newOrigins[index] = value;
    setOrigins(newOrigins);
  };

  const removeOrigin = (index: number) => {
    if (origins.length > 1) {
      const newOrigins = origins.filter((_, i) => i !== index);
      setOrigins(newOrigins);
    }
  };

  const generateToken = async () => {
    if (!jwtSecret.trim()) {
      setError("JWT secret is required");
      return;
    }

    const validOrigins = origins.filter((origin) => origin.trim() !== "");
    if (validOrigins.length === 0) {
      setError("At least one origin is required");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedToken(null);

    try {
      const response = await fetch("/api/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jwtSecret,
          origins: validOrigins,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate token");
        return;
      }

      setGeneratedToken(data.token);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate token"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      alert("Token copied to clipboard!");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Create JWT Token
          </h1>
          <button
            onClick={() => router.push("/")}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Back
          </button>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            JWT Secret
          </label>
          <input
            type="password"
            value={jwtSecret}
            onChange={(e) => setJwtSecret(e.target.value)}
            placeholder="Enter JWT secret"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Allowed Frame Ancestors Origins
          </label>
          <div className="space-y-3">
            {origins.map((origin, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => updateOrigin(index, e.target.value)}
                  placeholder={`Origin ${index + 1} (e.g., https://example.com)`}
                  className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                {origins.length > 1 && (
                  <button
                    onClick={() => removeOrigin(index)}
                    className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOrigin}
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Add Origin
            </button>
          </div>
        </div>

        <button
          onClick={generateToken}
          disabled={loading}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Generating..." : "Generate Token"}
        </button>

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {generatedToken && (
          <div className="space-y-3 rounded-md border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                Generated Token
              </h3>
              <button
                onClick={copyToClipboard}
                className="rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Copy
              </button>
            </div>
            <pre className="overflow-x-auto rounded bg-zinc-50 p-3 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {generatedToken}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
