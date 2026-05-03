"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getCategoryDetail } from "@/lib/api";
import { CategoryDetail } from "@/types/orchid";

type Props = {
  classKey: string; // e.g. "class0001"
};

export default function OrchidInfoCard({ classKey }: Props) {
  const [detail, setDetail] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!classKey) return;
    setDetail(null);
    setError("");
    setExpanded(false);
    setLoading(true);

    getCategoryDetail(classKey)
      .then(setDetail)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [classKey]);

  if (!classKey) return null;

  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
        <div className="mb-4 h-6 w-48 rounded-xl bg-white/10" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/10" />
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded-lg bg-white/10" />
          <div className="h-4 w-4/5 rounded-lg bg-white/10" />
          <div className="h-4 w-3/5 rounded-lg bg-white/10" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-sm text-amber-200">
        ⚠️ Không tải được thông tin class: {error}
      </div>
    );
  }

  if (!detail) return null;

  const name = detail.meta?.name || classKey;
  const specieName = detail.meta?.specie_name;
  const chineseName = detail.meta?.cultivar_chinese_name;
  const previewImages = detail.images.slice(0, 6);
  const hasMarkdown = !!detail.markdown?.trim();

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold md:text-2xl">{name}</h2>
          {specieName && (
            <p className="mt-0.5 text-sm italic text-white/55">{specieName}</p>
          )}
          {chineseName && (
            <p className="mt-0.5 text-sm text-white/45">{chineseName}</p>
          )}
          <p className="mt-1 text-xs text-white/35">{classKey}</p>
        </div>
        <Link
          href={`/orchids/${classKey}`}
          className="shrink-0 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-200 transition hover:bg-violet-500/20"
        >
          Xem chi tiết →
        </Link>
      </div>

      {/* Image gallery */}
      {previewImages.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-2">
          {previewImages.map((img, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
            >
              <img
                src={img}
                alt={`${classKey}-${i}`}
                className="h-28 w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* Markdown info */}
      {hasMarkdown && (
        <div>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              expanded ? "max-h-[2000px]" : "max-h-32"
            }`}
          >
            <div className="prose prose-sm prose-invert max-w-none text-white/80 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_li]:text-white/70 [&_p]:text-white/70 [&_strong]:text-white">
              <ReactMarkdown>{detail.markdown!}</ReactMarkdown>
            </div>
          </div>

          {!expanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0d0d10] to-transparent" />
          )}

          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 text-xs font-medium text-violet-300 hover:text-violet-200"
          >
            {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
          </button>
        </div>
      )}

      {!hasMarkdown && (
        <p className="text-sm text-white/40 italic">Chưa có thông tin mô tả.</p>
      )}
    </div>
  );
}
