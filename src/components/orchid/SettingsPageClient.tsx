"use client";

import { useEffect, useState } from "react";
import { getServerUrl, resetServerUrl, saveServerUrl } from "@/lib/settings";
import { checkServerApi } from "@/lib/api";

export default function SettingsPageClient() {
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  useEffect(() => {
    setUrl(getServerUrl());
  }, []);

  const handleSave = () => {
    saveServerUrl(url);
    setSaved(true);
    setTestResult(null);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetServerUrl();
    setUrl("http://127.0.0.1:8000");
    setTestResult(null);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    saveServerUrl(url);
    try {
      const data = await checkServerApi();
      setTestResult({ ok: true, msg: `Kết nối thành công — ${data.status}` });
    } catch (err) {
      setTestResult({
        ok: false,
        msg: err instanceof Error ? err.message : "Không kết nối được",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-57px)] bg-[radial-gradient(circle_at_top,_#1d1135,_#09090b_55%)] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Cài đặt
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Tùy chỉnh kết nối server và các thông số hệ thống.
          </p>
        </div>

        {/* Server URL */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <h2 className="mb-1 text-lg font-semibold">🔗 Server URL</h2>
          <p className="mb-4 text-sm text-white/55">
            Địa chỉ backend FastAPI đang chạy model AI.
          </p>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://127.0.0.1:8000"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
          />

          {testResult && (
            <div
              className={`mt-3 rounded-2xl border px-4 py-3 text-sm ${
                testResult.ok
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                  : "border-red-400/20 bg-red-500/10 text-red-200"
              }`}
            >
              {testResult.ok ? "✅ " : "❌ "}
              {testResult.msg}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleTest}
              disabled={testing}
              className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-emerald-500 disabled:opacity-60"
            >
              {testing ? "Đang kiểm tra..." : "Kiểm tra kết nối"}
            </button>

            <button
              onClick={handleSave}
              className="rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
            >
              {saved ? "✓ Đã lưu" : "Lưu"}
            </button>

            <button
              onClick={handleReset}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
            >
              Đặt lại mặc định
            </button>
          </div>
        </div>

        {/* About */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <h2 className="mb-1 text-lg font-semibold">ℹ️ Thông tin</h2>
          <p className="text-sm text-white/55">
            Orchid AI Web — hệ thống nhận diện và phân loại hoa lan bằng AI.
          </p>
          <div className="mt-4 space-y-2 text-sm text-white/60">
            <div>
              Frontend:{" "}
              <span className="text-white">Next.js 16 + Tailwind CSS 4</span>
            </div>
            <div>
              Backend:{" "}
              <span className="text-white">FastAPI + YOLO + EfficientNet</span>
            </div>
            <div>
              Số class:{" "}
              <span className="text-white">45 loài hoa lan</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
