import { z } from "zod";

import type { RequestPriority, RequestStatus } from "@/features/service-requests/types/service-requests";

const statusOptions: [RequestStatus, ...RequestStatus[]] = ["New", "Under Review", "Scheduled", "In Progress", "Resolved", "Closed"];
const priorityOptions: [RequestPriority, ...RequestPriority[]] = ["Critical", "High", "Medium", "Low"];

export const requestFormSchema = z.object({
  title: z.string().min(5, "Request title must be at least 5 characters."),
  requester: z.string().min(1, "Requester is required."),
  site: z.string().min(2, "Site is required."),
  asset: z.string().min(1, "Select a related asset before creating this service request."),
  status: z.enum(statusOptions),
  priority: z.enum(priorityOptions),
  scheduledFor: z.string().optional(),
  summary: z.string().min(12, "Issue summary must be at least 12 characters."),
});

export type RequestFormSchemaValues = z.infer<typeof requestFormSchema>;
