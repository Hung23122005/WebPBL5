type Props = {
  checkingServer: boolean;
  loadingDetect: boolean;
  loadingClassify: boolean;
  loadingDetectClassify: boolean;
  onCheckServer: () => void;
  onDetect: () => void;
  onClassify: () => void;
  onDetectAndClassify: () => void;
  onOpenHistory: () => void;
};

export default function ActionButtons({
  checkingServer,
  loadingDetect,
  loadingClassify,
  loadingDetectClassify,
  onCheckServer,
  onDetect,
  onClassify,
  onDetectAndClassify,
  onOpenHistory,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onCheckServer}
        disabled={checkingServer}
        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 font-semibold shadow-lg shadow-emerald-900/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {checkingServer ? "Đang kiểm tra..." : "Kiểm tra server"}
      </button>

      <button
        onClick={onDetect}
        disabled={loadingDetect}
        className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-5 py-3 font-semibold shadow-lg shadow-amber-900/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingDetect ? "Đang detect..." : "Detect"}
      </button>

      <button
        onClick={onClassify}
        disabled={loadingClassify}
        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold shadow-lg shadow-fuchsia-900/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingClassify ? "Đang classify..." : "Classify"}
      </button>

      <button
        onClick={onDetectAndClassify}
        disabled={loadingDetectClassify}
        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-3 font-semibold shadow-lg shadow-rose-900/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingDetectClassify
          ? "Đang detect + classify..."
          : "Detect + Classify"}
      </button>

      <button
        onClick={onOpenHistory}
        className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold transition hover:scale-[1.02] hover:bg-white/10"
      >
        Lịch sử
      </button>
    </div>
  );
}
