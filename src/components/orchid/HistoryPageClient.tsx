"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HistoryCard from "./HistoryCard";
import { HistoryItem } from "@/types/orchid";
import { clearHistory, deleteHistoryItem, getHistory } from "@/lib/history";

export default function HistoryPageClient() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistoryItems(getHistory());
  }, []);

  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistoryItems(updated);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistoryItems([]);
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("orchid_restore_history", JSON.stringify(item));
    }
    router.push("/");
  };

  return (
    <main className="min-h-[calc(100vh-57px)] bg-[radial-gradient(circle_at_top,_#1d1135,_#09090b_55%)] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <span className="text-base">🕘</span>
            Orchid Prediction History
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Lịch sử phân loại
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
            Xem lại các lần dự đoán trước đó, mở lại kết quả hoặc xóa lịch sử.
          </p>
        </header>

        <HistoryCard
          items={historyItems}
          onRestore={handleRestoreHistory}
          onDelete={handleDeleteHistory}
          onClear={handleClearHistory}
        />
      </div>
    </main>
  );
}
