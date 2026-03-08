export type RequestStatus = "New" | "Under Review" | "Scheduled" | "In Progress" | "Resolved" | "Closed";
export type RequestPriority = "Critical" | "High" | "Medium" | "Low";

export interface RequestRemark {
  id: string;
  author: string;
  role: string;
  message: string;
  createdAt: string;
}

export interface RequestTimelineEvent {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  actor: string;
}

export interface ServiceRequestRecord {
  id: string;
  ticketNumber: string;
  title: string;
  site: string;
  requester: string;
  category: string;
  assetName: string;
  status: RequestStatus;
  priority: RequestPriority;
  submittedAt: string;
  scheduledFor: string;
  summary: string;
  remarks: RequestRemark[];
  timeline: RequestTimelineEvent[];
}

export interface RequestFilterState {
  query: string;
  status: RequestStatus | "All";
  priority: RequestPriority | "All";
  site: string;
}

export interface ServiceRequestFormValues {
  title: string;
  requester: string;
  site: string;
  category: string;
  assetName: string;
  status: RequestStatus;
  priority: RequestPriority;
  scheduledFor: string;
  summary: string;
}
