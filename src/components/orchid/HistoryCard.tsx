import { HistoryItem } from "@/types/orchid";

type Props = {
  items: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("vi-VN");
}

export default function HistoryCard({
  items,
  onRestore,
  onDelete,
  onClear,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold md:text-2xl">
            Lịch sử phân loại
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Lưu các lần classify gần đây trên trình duyệt
          </p>
        </div>

        {!!items.length && (
          <button
            onClick={onClear}
            className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {!items.length ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-center text-white/45">
          <div>
            <div className="text-4xl">🕘</div>
            <p className="mt-3 text-base font-medium">Chưa có lịch sử</p>
            <p className="mt-1 text-sm text-white/35">
              Sau khi phân loại, kết quả sẽ được lưu ở đây
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <img
                    src={item.image_preview_url}
                    alt={item.predicted_class}
                    className="h-[120px] w-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".img-fallback")) {
                        const fallback = document.createElement("div");
                        fallback.className =
                          "img-fallback flex h-[120px] w-full items-center justify-center text-white/30 text-3xl";
                        fallback.textContent = "🖼️";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {item.predicted_class}
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {item.predicted_class_key || "Không có class key"}
                      </div>
                    </div>

                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                      {(item.confidence * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-white/70 md:grid-cols-2">
                    <div>
                      Chế độ:{" "}
                      <span className="font-medium text-white">
                        {item.mode === "classify"
                          ? "Classify"
                          : "Detect + Classify"}
                      </span>
                    </div>
                    <div>
                      Inference:{" "}
                      <span className="font-medium text-white">
                        {item.inference_ms.toFixed(1)} ms
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      Thời gian:{" "}
                      <span className="font-medium text-white">
                        {formatTime(item.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onRestore(item)}
                      className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                      Xem lại
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
