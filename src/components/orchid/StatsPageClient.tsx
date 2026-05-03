"use client";

import { useEffect, useState } from "react";
import { getHistory } from "@/lib/history";
import { HistoryItem } from "@/types/orchid";

type ClassCount = { key: string; count: number };

export default function StatsPageClient() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  if (!items.length) {
    return (
      <main className="min-h-[calc(100vh-57px)] bg-[radial-gradient(circle_at_top,_#1d1135,_#09090b_55%)] px-4 py-10 md:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            Thống kê
          </h1>
          <p className="mb-10 text-sm text-white/60">
            Tổng hợp các lần nhận diện hoa lan.
          </p>
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-center text-white/40">
            <div>
              <div className="text-5xl">📊</div>
              <p className="mt-3 text-base font-medium">Chưa có dữ liệu</p>
              <p className="mt-1 text-sm text-white/30">
                Hãy phân loại một vài ảnh để xem thống kê
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const total = items.length;
  const detectClassifyCount = items.filter(
    (i) => i.mode === "detect_classify",
  ).length;
  const classifyOnlyCount = total - detectClassifyCount;
  const avgConfidence =
    items.reduce((s, i) => s + i.confidence, 0) / total;
  const avgInference =
    items.reduce((s, i) => s + i.inference_ms, 0) / total;

  // top classes
  const classMap: Record<string, number> = {};
  items.forEach((i) => {
    const k = i.predicted_class_key || i.predicted_class;
    classMap[k] = (classMap[k] || 0) + 1;
  });
  const topClasses: ClassCount[] = Object.entries(classMap)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const maxCount = topClasses[0]?.count || 1;

  return (
    <main className="min-h-[calc(100vh-57px)] bg-[radial-gradient(circle_at_top,_#1d1135,_#09090b_55%)] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Thống kê
        </h1>
        <p className="mb-8 text-sm text-white/60">
          Tổng hợp {total} lần nhận diện hoa lan.
        </p>

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="🔢"
            label="Tổng lần nhận diện"
            value={total.toString()}
            color="violet"
          />
          <StatCard
            icon="🎯"
            label="Detect + Classify"
            value={detectClassifyCount.toString()}
            sub={`${((detectClassifyCount / total) * 100).toFixed(0)}% tổng`}
            color="amber"
          />
          <StatCard
            icon="✨"
            label="Độ tin cậy TB"
            value={`${(avgConfidence * 100).toFixed(1)}%`}
            color="emerald"
          />
          <StatCard
            icon="⚡"
            label="Inference TB"
            value={`${avgInference.toFixed(1)} ms`}
            color="pink"
          />
        </div>

        {/* Mode breakdown */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold">Chế độ sử dụng</h2>
            <div className="space-y-3">
              <ModeBar
                label="Detect + Classify"
                count={detectClassifyCount}
                total={total}
                color="from-pink-500 to-rose-500"
              />
              <ModeBar
                label="Classify only"
                count={classifyOnlyCount}
                total={total}
                color="from-violet-500 to-fuchsia-500"
              />
            </div>
          </div>

          {/* Confidence distribution */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold">
              Phân bố độ tin cậy
            </h2>
            <ConfidenceDist items={items} />
          </div>
        </div>

        {/* Top classes chart */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <h2 className="mb-5 text-lg font-semibold">
            Top class hay gặp nhất
          </h2>
          <div className="space-y-3">
            {topClasses.map((c, i) => (
              <div key={c.key} className="flex items-center gap-3">
                <div className="w-6 text-right text-sm text-white/40">
                  {i + 1}
                </div>
                <div className="w-28 truncate text-sm font-medium text-white">
                  {c.key}
                </div>
                <div className="flex-1">
                  <div className="h-6 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
                      style={{ width: `${(c.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-8 text-right text-sm font-semibold text-white/80">
                  {c.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  color: "violet" | "amber" | "emerald" | "pink";
}) {
  const colors = {
    violet: "border-violet-400/15 bg-violet-500/10",
    amber: "border-amber-400/15 bg-amber-500/10",
    emerald: "border-emerald-400/15 bg-emerald-500/10",
    pink: "border-pink-400/15 bg-pink-500/10",
  };

  return (
    <div
      className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${colors[color]}`}
    >
      <div className="mb-2 text-2xl">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/60">{label}</div>
      {sub && <div className="mt-1 text-xs text-white/40">{sub}</div>}
    </div>
  );
}

function ModeBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-white/75">{label}</span>
        <span className="font-semibold text-white">
          {count} ({pct.toFixed(0)}%)
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ConfidenceDist({ items }: { items: HistoryItem[] }) {
  const buckets = [
    { label: "90–100%", min: 0.9, max: 1.01 },
    { label: "70–90%", min: 0.7, max: 0.9 },
    { label: "50–70%", min: 0.5, max: 0.7 },
    { label: "<50%", min: 0, max: 0.5 },
  ];

  const counts = buckets.map((b) => ({
    ...b,
    count: items.filter((i) => i.confidence >= b.min && i.confidence < b.max)
      .length,
  }));

  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="space-y-3">
      {counts.map((b) => (
        <div key={b.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-white/75">{b.label}</span>
            <span className="font-semibold text-white">{b.count}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
              style={{ width: `${(b.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
