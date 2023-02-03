export interface NotificationModel {
    id?: number
    userId?: string
    title?: string
    description?: string
    notificationType?: string
    //ids comes in JSON, pairing a string key to an int value
    ids?: string
    viewed?: boolean

    createdDate?: string
}