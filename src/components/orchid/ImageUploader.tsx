import { ChangeEvent } from "react";

type Props = {
  previewUrl: string;
  file: File | null;
  onChooseFile: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ImageUploader({
  previewUrl,
  file,
  onChooseFile,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold md:text-2xl">Ảnh đầu vào</h2>
          <p className="mt-1 text-sm text-white/60">
            Chọn ảnh từ máy để detect hoặc classify.
          </p>
        </div>
        <div className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-medium text-fuchsia-200">
          Web + AI
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="h-[260px] w-full object-contain bg-black md:h-[420px]"
          />
        ) : (
          <div className="flex h-[260px] w-full flex-col items-center justify-center gap-3 bg-black/30 text-center text-white/50 md:h-[420px]">
            <div className="text-5xl">🖼️</div>
            <div>
              <p className="text-base font-medium">Chưa có ảnh nào</p>
              <p className="mt-1 text-sm text-white/40">
                Hãy chọn ảnh hoa lan từ máy của bạn
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
        {file ? (
          <span>
            Ảnh đã chọn:{" "}
            <span className="font-medium text-white">{file.name}</span>
          </span>
        ) : (
          <span>Chưa chọn file nào.</span>
        )}
      </div>

      <div className="mt-5">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 font-semibold shadow-lg shadow-blue-900/30 transition hover:scale-[1.02] hover:bg-blue-500">
          Chọn ảnh từ máy
          <input
            type="file"
            accept="image/*"
            onChange={onChooseFile}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
