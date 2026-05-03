"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import ActionButtons from "./ActionButtons";
import StatusMessage from "./StatusMessage";
import DetectResultCard from "./DetectResultCard";
import ClassifyResultCard from "./ClassifyResultCard";
import OrchidInfoCard from "./OrchidInfoCard";
import { ClassifyResultSkeleton, DetectResultSkeleton } from "./Skeleton";

import { ClassifyResponse, DetectResponse, HistoryItem } from "@/types/orchid";
import { checkServerApi, classifyApi, detectApi } from "@/lib/api";
import { base64ToFile } from "@/lib/utils";
import { addHistoryItem, buildHistoryItem } from "@/lib/history";

function normalizeClassKey(
  result: ClassifyResponse | null | undefined,
): string {
  if (!result || !result.results?.length) return "";

  const topItem = result.results[0];

  if (topItem.class_name && /^class\d{4}$/i.test(topItem.class_name.trim())) {
    return topItem.class_name.trim().toLowerCase();
  }

  if (typeof topItem.class_id === "number") {
    return `class${String(topItem.class_id).padStart(4, "0")}`;
  }

  return "";
}

export default function OrchidDashboard() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [result, setResult] = useState<ClassifyResponse | null>(null);
  const [detectResult, setDetectResult] = useState<DetectResponse | null>(null);

  const [loadingClassify, setLoadingClassify] = useState(false);
  const [loadingDetect, setLoadingDetect] = useState(false);
  const [loadingDetectClassify, setLoadingDetectClassify] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);

  const [serverStatus, setServerStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem("orchid_restore_history");
    if (!raw) return;

    try {
      const item = JSON.parse(raw) as HistoryItem;

      setPreviewUrl(item.image_preview_url);
      setResult({
        top_class: item.predicted_class,
        top_confidence: item.confidence,
        results: item.top_results,
        inference_ms: item.inference_ms,
      });
      setDetectResult(null);
      setError("");
    } catch (err) {
      console.error("Không restore được history item:", err);
    } finally {
      sessionStorage.removeItem("orchid_restore_history");
    }
  }, []);

  const predictedClassKey = normalizeClassKey(result);

  const resetOutputs = () => {
    setResult(null);
    setDetectResult(null);
    setError("");
  };

  const handleChooseFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (!selectedFile) return;

    setFile(selectedFile);
    resetOutputs();

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleCheckServer = async () => {
    setCheckingServer(true);
    setServerStatus("");
    setError("");

    try {
      const data = await checkServerApi();
      setServerStatus(`Server hoạt động: ${data.status}`);
    } catch (err) {
      setServerStatus("Server chưa kết nối");
      setError(err instanceof Error ? err.message : "Không thể kết nối server");
    } finally {
      setCheckingServer(false);
    }
  };

  const saveResultToHistory = async (
    classifyData: ClassifyResponse,
    mode: "classify" | "detect_classify",
    imageFile: File,
  ) => {
    const classKey = normalizeClassKey(classifyData);

    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });

    const item = buildHistoryItem({
      result: classifyData,
      previewUrl: base64,
      predictedClassKey: classKey,
      mode,
    });

    addHistoryItem(item);
  };

  const handleClassify = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh trước khi classify.");
      return;
    }

    setLoadingClassify(true);
    setError("");
    setResult(null);

    try {
      const data = await classifyApi(file);
      setResult(data);
      await saveResultToHistory(data, "classify", file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi classify");
    } finally {
      setLoadingClassify(false);
    }
  };

  const handleDetect = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh trước khi detect.");
      return;
    }

    setLoadingDetect(true);
    setError("");
    setDetectResult(null);

    try {
      const data = await detectApi(file);
      setDetectResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi detect");
    } finally {
      setLoadingDetect(false);
    }
  };

  const handleDetectAndClassify = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh trước khi detect + classify.");
      return;
    }

    setLoadingDetectClassify(true);
    setError("");
    setResult(null);
    setDetectResult(null);

    try {
      const detectData = await detectApi(file);
      setDetectResult(detectData);

      const croppedFile = await base64ToFile(detectData.cropped_image_base64);
      const classifyData = await classifyApi(croppedFile);
      setResult(classifyData);

      await saveResultToHistory(classifyData, "detect_classify", file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi detect + classify");
    } finally {
      setLoadingDetectClassify(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-57px)] bg-[radial-gradient(circle_at_top,_#1d1135,_#09090b_55%)] text-white">
      <div className="mx-auto flex min-h-[calc(100vh-57px)] w-full max-w-7xl flex-col px-4 py-8 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Nhận diện hoa lan
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
            Tải ảnh lên, chọn chế độ detect / classify để nhận diện loài hoa lan bằng AI.
          </p>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <ImageUploader
              previewUrl={previewUrl}
              file={file}
              onChooseFile={handleChooseFile}
            />

            <ActionButtons
              checkingServer={checkingServer}
              loadingDetect={loadingDetect}
              loadingClassify={loadingClassify}
              loadingDetectClassify={loadingDetectClassify}
              onCheckServer={handleCheckServer}
              onDetect={handleDetect}
              onClassify={handleClassify}
              onDetectAndClassify={handleDetectAndClassify}
              onOpenHistory={() => router.push("/history")}
            />

            <StatusMessage serverStatus={serverStatus} error={error} />

            {loadingDetect || loadingDetectClassify ? (
              <DetectResultSkeleton />
            ) : (
              <DetectResultCard detectResult={detectResult} />
            )}
          </div>

          <div className="space-y-6">
            {loadingClassify || loadingDetectClassify ? (
              <ClassifyResultSkeleton />
            ) : (
              <ClassifyResultCard
                result={result}
                predictedClassKey={predictedClassKey}
              />
            )}

            {/* Thông tin class từ server */}
            {predictedClassKey && !loadingClassify && !loadingDetectClassify && (
              <OrchidInfoCard classKey={predictedClassKey} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
