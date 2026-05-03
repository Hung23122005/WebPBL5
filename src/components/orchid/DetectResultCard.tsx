import { DetectResponse } from "@/types/orchid";

type Props = {
  detectResult: DetectResponse | null;
};

export default function DetectResultCard({ detectResult }: Props) {
  if (!detectResult) return null;

  const croppedPreviewUrl = detectResult.cropped_image_base64
    ? `data:image/jpeg;base64,${detectResult.cropped_image_base64}`
    : "";

  const topPercent = detectResult.detections?.length
    ? (detectResult.detections[0].confidence * 100).toFixed(1)
    : "0.0";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Kết quả detect</h3>
          <p className="text-sm text-white/55">
            Box tốt nhất và ảnh crop từ YOLO
          </p>
        </div>
        <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
          Detect {detectResult.detect_ms.toFixed(1)} ms
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className="mb-2 text-sm font-semibold text-white/80">
            Ảnh crop
          </div>
          {croppedPreviewUrl ? (
            <img
              src={croppedPreviewUrl}
              alt="Cropped"
              className="h-[240px] w-full rounded-xl bg-black object-contain"
            />
          ) : (
            <div className="flex h-[240px] items-center justify-center text-white/40">
              Chưa có ảnh crop
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 text-sm font-semibold text-white/80">
            Thông tin detect
          </div>

          <div className="space-y-2 text-sm text-white/75">
            <div>
              Độ tin cậy box tốt nhất:{" "}
              <span className="font-semibold text-white">{topPercent}%</span>
            </div>
            <div>
              Crop box:{" "}
              <span className="font-semibold text-white">
                [{detectResult.crop_box.join(", ")}]
              </span>
            </div>
            <div>
              Kích thước ảnh gốc:{" "}
              <span className="font-semibold text-white">
                {detectResult.image_size.join(" × ")}
              </span>
            </div>
            <div>
              Kích thước ảnh crop:{" "}
              <span className="font-semibold text-white">
                {detectResult.crop_size.join(" × ")}
              </span>
            </div>
            <div>
              Số detections:{" "}
              <span className="font-semibold text-white">
                {detectResult.detections.length}
              </span>
            </div>
          </div>

          {!!detectResult.detections.length && (
            <div className="mt-4 space-y-3">
              {detectResult.detections.slice(0, 5).map((item, index) => (
                <div
                  key={`${item.class_id}-${index}`}
                  className="rounded-2xl border border-white/8 bg-white/[0.04] p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-white">
                      Detection {index + 1}
                    </span>
                    <span className="text-sm text-white/75">
                      {(item.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-white/55">
                    Box: [{item.box.join(", ")}]
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
