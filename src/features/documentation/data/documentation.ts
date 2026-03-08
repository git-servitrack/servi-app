import type { DocumentationFile, UploadQueueItem, UploadValidationItem } from "@/features/documentation/types/documentation";

export const documentationFiles: DocumentationFile[] = [
  {
    id: "DOC-101",
    title: "Generator Panel Wiring Layout",
    fileName: "generator-panel-layout-v4.pdf",
    type: "PDF",
    size: "4.2 MB",
    uploadedAt: "Mar 8, 2026",
    uploadedBy: "R. Santos",
    status: "Verified",
    summary: "Latest approved wiring layout used during central office electrical troubleshooting and maintenance planning.",
    previewLabel: "Panel layout sheet",
    tags: ["Electrical", "Generator", "Approved"],
    links: [
      { label: "Linked asset", value: "GEN-104" },
      { label: "Related work order", value: "MW-204" },
      { label: "Site", value: "Central Office" },
    ],
  },
  {
    id: "DOC-102",
    title: "Elevator Door Sensor Photo Set",
    fileName: "elevator-door-sensor-inspection.zip",
    type: "Image",
    size: "18.6 MB",
    uploadedAt: "Mar 8, 2026",
    uploadedBy: "L. Ramos",
    status: "Pending Review",
    summary: "Inspection images documenting door sensor alignment and visible wear before replacement approval.",
    previewLabel: "Sensor image gallery",
    tags: ["Mechanical", "Inspection", "Pending"],
    links: [
      { label: "Linked asset", value: "ELV-14" },
      { label: "Related work order", value: "MW-198" },
      { label: "Site", value: "Annex Building" },
    ],
  },
  {
    id: "DOC-103",
    title: "AHU Preventive Maintenance Checklist",
    fileName: "ahu-pm-checklist-march.xlsx",
    type: "Checklist",
    size: "780 KB",
    uploadedAt: "Mar 6, 2026",
    uploadedBy: "J. Navarro",
    status: "Verified",
    summary: "Routine preventive maintenance checklist for air handling units, prepared for recurring monthly service.",
    previewLabel: "Checklist excerpt",
    tags: ["HVAC", "PM", "Operations"],
    links: [
      { label: "Linked asset", value: "AHU-08" },
      { label: "Maintenance plan", value: "PM-MAR-17" },
      { label: "Site", value: "North Warehouse" },
    ],
  },
];

export const uploadValidationItems: UploadValidationItem[] = [
  {
    id: "VAL-101",
    label: "Accepted file types",
    message: "Images, PDF manuals, spreadsheets, and checklist exports are accepted.",
    level: "success",
  },
  {
    id: "VAL-102",
    label: "Recommended naming",
    message: "Use asset code or work-order reference in the file name for cleaner retrieval later.",
    level: "warning",
  },
  {
    id: "VAL-103",
    label: "Blocked upload sample",
    message: "Files above 25 MB or missing linked operational context should be rejected before submission.",
    level: "error",
  },
];

export const uploadQueueItems: UploadQueueItem[] = [
  {
    id: "UP-101",
    name: "switchgear-front-panel.jpg",
    type: "Image",
    size: "3.4 MB",
    progress: 100,
    status: "Ready",
  },
  {
    id: "UP-102",
    name: "mw-204-repair-notes.pdf",
    type: "PDF",
    size: "1.9 MB",
    progress: 68,
    status: "Processing",
  },
  {
    id: "UP-103",
    name: "site-video-export.mov",
    type: "Image",
    size: "41.0 MB",
    progress: 0,
    status: "Blocked",
  },
];
