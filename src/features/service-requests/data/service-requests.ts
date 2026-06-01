import type {
  RequestFilterState,
  ServiceRequestFormValues,
  ServiceRequestRecord,
} from "@/features/service-requests/types/service-requests";

export const serviceRequestRecords: ServiceRequestRecord[] = [
  {
    id: "REQ-101",
    ticketNumber: "SR-783",
    title: "Badge scanner intermittently offline",
    site: "Central Office",
    requesterId: "mock-requester-1",
    requester: "M. Garcia",
    category: "Access Control",
    assetId: "mock-asset-1",
    assetName: "Lobby Access Reader",
    status: "Scheduled",
    priority: "High",
    submittedAt: "2026-03-08 08:20",
    scheduledFor: "2026-03-08 13:30",
    summary: "Main lobby scanner drops connection during the morning entry rush and requires technician inspection.",
    remarks: [
      {
        id: "RM-1",
        author: "A. Dela Cruz",
        role: "Dispatcher",
        message: "Escalated after repeated staff access delays during shift handoff.",
        createdAt: "Today, 8:35 AM",
      },
      {
        id: "RM-2",
        author: "R. Santos",
        role: "Technician",
        message: "Initial review suggests power fluctuation or reader controller instability.",
        createdAt: "Today, 9:05 AM",
      },
    ],
    timeline: [
      {
        id: "TL-1",
        title: "Request submitted",
        description: "Requester logged scanner outage affecting office access.",
        createdAt: "Today, 8:20 AM",
        actor: "M. Garcia",
      },
      {
        id: "TL-2",
        title: "Request reviewed",
        description: "Dispatcher verified urgency and linked the record to the lobby access asset.",
        createdAt: "Today, 8:35 AM",
        actor: "A. Dela Cruz",
      },
      {
        id: "TL-3",
        title: "Visit scheduled",
        description: "Technician assigned for same-day inspection window.",
        createdAt: "Today, 9:10 AM",
        actor: "Service Desk",
      },
    ],
  },
  {
    id: "REQ-102",
    ticketNumber: "SR-779",
    title: "Roll-up door sensor misalignment",
    site: "North Warehouse",
    requesterId: "mock-requester-2",
    requester: "A. Cruz",
    category: "Warehouse Equipment",
    assetId: "mock-asset-2",
    assetName: "Dock Door Sensor",
    status: "Under Review",
    priority: "Medium",
    submittedAt: "2026-03-08 07:45",
    scheduledFor: "Pending review",
    summary: "Door closes inconsistently after pallet movement and occasionally requires manual reset.",
    remarks: [
      {
        id: "RM-3",
        author: "J. Ramos",
        role: "Warehouse Lead",
        message: "Issue observed twice during outbound loading this morning.",
        createdAt: "Today, 7:50 AM",
      },
    ],
    timeline: [
      {
        id: "TL-4",
        title: "Request submitted",
        description: "Warehouse lead reported inconsistent sensor alignment on dock door.",
        createdAt: "Today, 7:45 AM",
        actor: "A. Cruz",
      },
      {
        id: "TL-5",
        title: "Awaiting triage",
        description: "Dispatch queue pending technician availability check.",
        createdAt: "Today, 8:00 AM",
        actor: "Service Desk",
      },
    ],
  },
  {
    id: "REQ-103",
    ticketNumber: "SR-774",
    title: "Server room cooling alarm warning",
    site: "Annex Building",
    requesterId: "mock-requester-3",
    requester: "P. Fernandez",
    category: "Climate Control",
    assetId: "mock-asset-3",
    assetName: "Annex Server Cooling Unit",
    status: "New",
    priority: "Critical",
    submittedAt: "2026-03-07 16:10",
    scheduledFor: "Unassigned",
    summary: "Alarm warning triggered overnight and onsite temperature has climbed beyond normal threshold.",
    remarks: [
      {
        id: "RM-4",
        author: "P. Fernandez",
        role: "IT Operations",
        message: "Requested immediate assessment due to rack temperature increase.",
        createdAt: "Yesterday, 4:20 PM",
      },
    ],
    timeline: [
      {
        id: "TL-6",
        title: "Request opened",
        description: "Critical cooling warning reported by IT operations.",
        createdAt: "Yesterday, 4:10 PM",
        actor: "P. Fernandez",
      },
    ],
  },
];

export const requestFilterOptions = {
  statuses: ["All", "New", "Under Review", "Scheduled", "In Progress", "Resolved", "Closed"] as const,
  priorities: ["All", "Critical", "High", "Medium", "Low"] as const,
  sites: ["All", "Central Office", "North Warehouse", "Annex Building"],
};

export const defaultRequestFilters: RequestFilterState = {
  query: "",
  status: "All",
  priority: "All",
  site: "All",
};

export const emptyServiceRequestFormValues: ServiceRequestFormValues = {
  title: "",
  requester: "",
  site: "Central Office",
  asset: "",
  status: "New",
  priority: "Medium",
  scheduledFor: "",
  summary: "",
};
