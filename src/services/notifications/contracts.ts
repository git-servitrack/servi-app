export type ApiNotificationType =
  | "Damage Detection"
  | "Documentation"
  | "Maintenance"
  | "Service Request"
  | "Spare Parts";

export type ApiNotificationRelatedModel =
  | "DamageDetection"
  | "MediaFile"
  | "Maintenance"
  | "ServiceRequest"
  | "SparePart";

export interface ApiNotificationRecord {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: ApiNotificationType;
  relatedModel?: ApiNotificationRelatedModel;
  relatedId?: string;
  link?: string;
  readAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: ApiNotificationType;
  relatedModel?: ApiNotificationRelatedModel;
  relatedId?: string;
  link?: string;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationUnreadCount {
  count: number;
}
