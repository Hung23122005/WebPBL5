import { ClassifyResponse, HistoryItem } from "@/types/orchid";

const STORAGE_KEY = "orchid_history";

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteHistoryItem(id: string) {
  const items = getHistory().filter((item) => item.id !== id);
  saveHistory(items);
  return items;
}

export function buildHistoryItem(params: {
  result: ClassifyResponse;
  previewUrl: string;
  predictedClassKey: string;
  mode: "classify" | "detect_classify";
}): HistoryItem {
  const { result, previewUrl, predictedClassKey, mode } = params;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: Date.now(),
    image_preview_url: previewUrl,
    predicted_class: result.top_class,
    predicted_class_key: predictedClassKey,
    confidence: result.top_confidence,
    inference_ms: result.inference_ms,
    mode,
    top_results: result.results,
  };
}

export function addHistoryItem(item: HistoryItem) {
  const current = getHistory();
  const updated = [item, ...current].slice(0, 50);
  saveHistory(updated);
  return updated;
}
