import ApiUrls from "../common/Links";
import {httpDelete, httpGet, httpPost, httpPut} from "../common/MyUtil";
import {NotificationModel} from "../model/user/NotificationModel";

export class NotificationService {

    checkForNewNotifications(userId: string): Promise<number> {
        const url = ApiUrls.userNotificationsCheck(userId)
        return httpGet(url)
    }

    fetchNotifications(userId: string): Promise<NotificationModel[]> {
        const url = ApiUrls.userNotifications(userId)
        return httpGet(url)
    }

    createNotification(userId: string, notification: NotificationModel): Promise<NotificationModel> {
        const url = ApiUrls.userNotifications(userId)
        return httpPost(url, notification)
    }

    updateNotifications(userId: string, notifications: NotificationModel[]): Promise<NotificationModel[]> {
        const url = ApiUrls.userNotifications(userId)
        return httpPut(url, notifications)
    }

    deleteNotifications(userId: string, notificationIds: number[]): Promise<void> {
        const url = ApiUrls.userNotifications(userId)
        return httpDelete(url, notificationIds)
    }
}