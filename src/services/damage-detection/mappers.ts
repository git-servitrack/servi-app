import type { DocumentationVisionAnalysis, VisionFinding, VisionSeverity } from "@/features/documentation/types/documentation";
import type { ApiDamageDetectionRecord } from "@/services/damage-detection/contracts";

export const DAMAGE_DETECTION_FIELDS = [
  "_id",
  "mediaFile",
  "asset",
  "serviceRequest",
  "maintenance",
  "modelName",
  "modelVersion",
  "modelPath",
  "topLabel",
  "confidenceScore",
  "allPredictions",
  "severityLevel",
  "detectedDamageLabels",
  "suggestedMaintenanceAction",
  "status",
  "errorMessage",
  "createdBy",
  "createdAt",
  "updatedAt",
].join(",");

export const DAMAGE_DETECTION_POPULATE = [
  "mediaFile.title",
  "mediaFile.url",
  "mediaFile.purpose",
  "createdBy.username",
  "createdBy.firstName",
  "createdBy.lastName",
  "createdBy.email",
].join(",");

function formatDateTime(value?: string) {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function labelToTitle(label: string) {
  return label
    .replace(/^with_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFindingDetail(item: ApiDamageDetectionRecord, label: string) {
  if (label === item.topLabel) return "Top model prediction for this image.";
  if (item.detectedDamageLabels.includes(label)) return "Detected damage label retained in the result.";
  return "Class confidence returned by the Teachable Machine model.";
}

function toFinding(item: ApiDamageDetectionRecord): VisionFinding[] {
  return item.allPredictions.map((prediction) => ({
    label: labelToTitle(prediction.label),
    confidence: Math.round(prediction.confidence * 100),
    detail: getFindingDetail(item, prediction.label),
  }));
}

function toVisionSeverity(severity: ApiDamageDetectionRecord["severityLevel"]): VisionSeverity {
  return severity;
}

export function getDamageDetectionMediaFileId(item: ApiDamageDetectionRecord) {
  return typeof item.mediaFile === "string" ? item.mediaFile : item.mediaFile._id;
}

export function mapApiDamageDetectionToVisionAnalysis(
  item?: ApiDamageDetectionRecord | null,
): DocumentationVisionAnalysis {
  if (!item) {
    return {
      applicable: false,
      skipReason: "No damage detection result has been recorded for this image.",
      modelProfile: "Teachable Machine TensorFlow.js",
    };
  }

  if (item.status === "Failed") {
    return {
      applicable: false,
      skipReason: item.errorMessage || "Damage detection failed. Please re-upload or analyze again.",
      modelProfile: `${item.modelName} (${item.modelVersion})`,
      analyzedAt: formatDateTime(item.updatedAt ?? item.createdAt),
    };
  }

  const confidencePercent = Math.round(item.confidenceScore * 100);
  const topLabel = labelToTitle(item.topLabel);

  return {
    applicable: true,
    severity: toVisionSeverity(item.severityLevel),
    modelProfile: `${item.modelName} (${item.modelVersion})`,
    analyzedAt: formatDateTime(item.updatedAt ?? item.createdAt),
    summary:
      item.status === "Low Confidence"
        ? `Low-confidence result. Top prediction was ${topLabel} at ${confidencePercent}%. Manual inspection is recommended.`
        : `${item.status}: ${topLabel} was detected with ${confidencePercent}% confidence.`,
    findings: toFinding(item),
    actions: [item.suggestedMaintenanceAction],
  };
}

export function getLatestDamageDetectionByMediaFile(items: ApiDamageDetectionRecord[]) {
  const latestByMediaFile = new Map<string, ApiDamageDetectionRecord>();

  items.forEach((item) => {
    const mediaFileId = getDamageDetectionMediaFileId(item);
    const current = latestByMediaFile.get(mediaFileId);
    const currentTime = current?.createdAt ? new Date(current.createdAt).getTime() : 0;
    const nextTime = item.createdAt ? new Date(item.createdAt).getTime() : 0;

    if (!current || nextTime >= currentTime) {
      latestByMediaFile.set(mediaFileId, item);
    }
  });

  return latestByMediaFile;
}
