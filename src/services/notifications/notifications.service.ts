import { createApiResult, requestEnvelope, requestJson } from "@/services/http/client";
import type { ApiResult, QueryParams } from "@/services/http/types";
import type {
  ApiNotificationRecord,
  NotificationRecord,
  NotificationUnreadCount,
} from "@/services/notifications/contracts";

function mapNotification(notification: ApiNotificationRecord): NotificationRecord {
  return {
    id: notification._id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    relatedModel: notification.relatedModel,
    relatedId: notification.relatedId,
    link: notification.link,
    readAt: notification.readAt ?? null,
    createdAt: notification.createdAt,
  };
}

export const notificationsService = {
  async list(query?: QueryParams): Promise<ApiResult<NotificationRecord[]>> {
    return createApiResult(async () => {
      const notifications = await requestJson<ApiNotificationRecord[]>("/notifications", {
        query: {
          limit: 10,
          sort: "-createdAt",
          ...query,
        },
      });

      return notifications.map(mapNotification);
    });
  },

  async unreadCount(): Promise<ApiResult<NotificationUnreadCount>> {
    return createApiResult(() => requestJson<NotificationUnreadCount>("/notifications/unread-count"));
  },

  async markAsRead(id: string): Promise<ApiResult<NotificationRecord>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<ApiNotificationRecord>(`/notifications/${id}/read`, {
        method: "PATCH",
      });

      if (!result.data) throw new Error("Notification response did not include data.");

      return mapNotification(result.data);
    });
  },

  async markAllAsRead(): Promise<ApiResult<{ modifiedCount: number }>> {
    return createApiResult(async () => {
      const result = await requestEnvelope<{ modifiedCount: number }>("/notifications/read-all", {
        method: "PATCH",
      });

      return result.data ?? { modifiedCount: 0 };
    });
  },
};
