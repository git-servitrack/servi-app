import { z } from "zod";

import type { RequestPriority, RequestStatus } from "@/features/service-requests/types/service-requests";

const statusOptions: [RequestStatus, ...RequestStatus[]] = ["New", "Under Review", "Scheduled", "In Progress", "Resolved", "Closed"];
const priorityOptions: [RequestPriority, ...RequestPriority[]] = ["Critical", "High", "Medium", "Low"];

export const requestFormSchema = z.object({
  title: z.string().min(5, "Request title must be at least 5 characters."),
  requester: z.string().min(2, "Requester name is required."),
  site: z.string().min(2, "Site is required."),
  category: z.string().min(2, "Category is required."),
  assetName: z.string().min(2, "Related asset is required."),
  status: z.enum(statusOptions),
  priority: z.enum(priorityOptions),
  scheduledFor: z.string().optional(),
  summary: z.string().min(12, "Issue summary must be at least 12 characters."),
});

export type RequestFormSchemaValues = z.infer<typeof requestFormSchema>;
