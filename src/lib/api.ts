import {
  ClassifyResponse,
  DetectResponse,
  HealthResponse,
} from "@/types/orchid";
import { getServerUrl } from "@/lib/settings";

export async function checkServerApi(): Promise<HealthResponse> {
  const res = await fetch(`${getServerUrl()}/health`);

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
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lỗi detect ${res.status}: ${text}`);
  }

  return res.json();
}
