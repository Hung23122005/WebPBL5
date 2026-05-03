import { ClassifyResponse } from "@/types/orchid";

type Props = {
  result: ClassifyResponse | null;
  predictedClassKey?: string;
};

export default function ClassifyResultCard({
  result,
  predictedClassKey,
}: Props) {
  if (!result) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold md:text-2xl">
            Kết quả phân loại
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Kết quả top-1 và top-k từ mô hình AI.
          </p>
        </div>

        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-center text-white/45">
          <div>
            <div className="text-5xl">✨</div>
            <p className="mt-3 text-base font-medium">
              Chưa có kết quả phân loại
            </p>
            <p className="mt-1 text-sm text-white/35">
              Hãy chọn ảnh và bấm classify hoặc detect + classify
            </p>
          </div>
        </div>
      </div>
    );
  }

  const topPercent = (result.top_confidence * 100).toFixed(1);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold md:text-2xl">
            Kết quả phân loại
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Kết quả top-1 và top-k từ mô hình AI.
          </p>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
          Inference {result.inference_ms.toFixed(1)} ms
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-fuchsia-400/15 bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 p-5">
          <div className="mb-2 text-sm uppercase tracking-[0.2em] text-fuchsia-200/80">
            Top-1 Prediction
          </div>

          <div className="text-4xl font-bold tracking-tight">
            {result.top_class}
          </div>

          {predictedClassKey && (
            <div className="mt-2 text-sm text-white/65">
              Class key:{" "}
              <span className="font-medium text-white">
                {predictedClassKey}
              </span>
            </div>
          )}

          <div className="mt-3 text-lg text-pink-200">
            Độ tin cậy: <span className="font-semibold">{topPercent}%</span>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-white/60">
              <span>Confidence</span>
              <span>{topPercent}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-500"
                style={{ width: `${result.top_confidence * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 text-sm font-semibold text-white/80">
            Top {result.results.length} kết quả
          </div>

          <div className="space-y-3">
            {result.results.map((item) => {
              const percent = (item.confidence * 100).toFixed(1);

              return (
                <div
                  key={item.rank}
                  className="rounded-2xl border border-white/8 bg-white/[0.04] p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          item.rank === 1
                            ? "bg-fuchsia-500 text-white"
                            : "bg-white/10 text-white/80"
                        }`}
                      >
                        {item.rank}
                      </div>
                      <span className="font-medium text-white">
                        {item.class_name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white/80">
                      {percent}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.rank === 1
                          ? "bg-gradient-to-r from-fuchsia-500 to-violet-500"
                          : "bg-gradient-to-r from-slate-400 to-slate-200"
                      }`}
                      style={{ width: `${item.confidence * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
