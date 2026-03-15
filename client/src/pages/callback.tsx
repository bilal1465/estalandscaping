import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function CallbackPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      setStatus("error");
      setError("No authorization code in URL. Start the flow by visiting /api/auth/gmail");
      return;
    }

    const base = import.meta.env.VITE_API_URL || "";
    fetch(`${base}/api/auth/gmail/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.refresh_token) {
          setRefreshToken(data.refresh_token);
          setStatus("success");
        } else {
          setStatus("error");
          setError(data.error || data.details || "No refresh token returned.");
        }
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message || "Request failed.");
      });
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white p-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-forest border-t-transparent mb-4" />
          <p className="text-gray-600">Exchanging code for refresh token…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white p-4">
        <div className="max-w-md w-full rounded-xl bg-white p-6 shadow-lg">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Authorization failed</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <a
            href="/api/auth/gmail"
            className="inline-block rounded-lg bg-forest px-4 py-2 text-white hover:bg-forest/90"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white p-4">
      <div className="max-w-lg w-full rounded-xl bg-white p-6 shadow-lg">
        <h1 className="text-xl font-semibold text-forest font-serif mb-2">Gmail connected</h1>
        <p className="text-gray-600 mb-4">
          Copy the refresh token below and add it to your environment variables.
        </p>
        <div className="rounded-lg bg-gray-100 p-4 mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">GMAIL_REFRESH_TOKEN</label>
          <textarea
            readOnly
            className="w-full min-h-[80px] text-sm font-mono bg-white border border-gray-200 rounded p-2"
            value={refreshToken || ""}
          />
          <button
            type="button"
            onClick={() => refreshToken && navigator.clipboard.writeText(refreshToken)}
            className="mt-2 text-sm text-forest hover:underline"
          >
            Copy to clipboard
          </button>
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>1. Local:</strong> Add to <code className="bg-gray-100 px-1">.env.local</code>:
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            GMAIL_REFRESH_TOKEN={refreshToken ? "(paste the token above)" : ""}
          </pre>
          <p>
            <strong>2. Vercel:</strong> Project → Settings → Environment Variables → add{" "}
            <code className="bg-gray-100 px-1">GMAIL_REFRESH_TOKEN</code> with the value above, then
            redeploy.
          </p>
          <p>
            <strong>3. Test:</strong> Visit <a href="/api/test-email" className="text-forest underline">/api/test-email</a> to send a test
            email to info@estalandscaping.com.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setLocation("/")}
          className="mt-6 rounded-lg bg-forest px-4 py-2 text-white hover:bg-forest/90"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
