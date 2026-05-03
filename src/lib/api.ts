import {
  CategoryDetail,
  CategoryMeta,
  ClassifyResponse,
  DetectResponse,
  HealthResponse,
} from "@/types/orchid";
import { getServerUrl } from "@/lib/settings";

// Header bỏ qua trang cảnh báo của ngrok free
const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };

export async function checkServerApi(): Promise<HealthResponse> {
  const res = await fetch(`${getServerUrl()}/health`, {
    headers: NGROK_HEADERS,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lỗi server ${res.status}: ${text}`);
  }
  return res.json();
}

export async function classifyApi(file: File): Promise<ClassifyResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${getServerUrl()}/classify?topk=5`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lỗi classify ${res.status}: ${text}`);
  }
  return res.json();
}

export async function detectApi(file: File): Promise<DetectResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${getServerUrl()}/detect`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lỗi detect ${res.status}: ${text}`);
  }
  return res.json();
}

export function toClassCode(classId: number): string {
  return `class${String(classId).padStart(4, "0")}`;
}

export async function getCategoryDetail(classId: string): Promise<CategoryDetail> {
  const res = await fetch(`${getServerUrl()}/categories/${classId}`, {
    headers: NGROK_HEADERS,
  });
  if (!res.ok) throw new Error(`Không lấy được thông tin class: ${classId}`);
  return res.json();
}

export async function getAllCategories(): Promise<{ categories: CategoryMeta[] }> {
  const res = await fetch(`${getServerUrl()}/categories`, {
    headers: NGROK_HEADERS,
  });
  if (!res.ok) throw new Error("Không lấy được danh sách class");
  return res.json();
}
