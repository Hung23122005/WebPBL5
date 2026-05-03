export type ClassResult = {
  rank: number;
  class_id: number;
  class_name: string;
  confidence: number;
};

export type ClassifyResponse = {
  top_class: string;
  top_confidence: number;
  results: ClassResult[];
  inference_ms: number;
  image_size?: number[];
};

export type DetectionItem = {
  class_id: number;
  confidence: number;
  box: number[];
  area: number;
};

export type DetectResponse = {
  message: string;
  detect_ms: number;
  image_size: number[];
  crop_box: number[];
  crop_size: number[];
  detections: DetectionItem[];
  cropped_image_base64: string;
};

export type HealthResponse = {
  status: string;
  timestamp: number;
};

export type HistoryItem = {
  id: string;
  created_at: number;
  image_preview_url: string;
  predicted_class: string;
  predicted_class_key: string;
  confidence: number;
  inference_ms: number;
  mode: "classify" | "detect_classify";
  top_results: ClassResult[];
};
