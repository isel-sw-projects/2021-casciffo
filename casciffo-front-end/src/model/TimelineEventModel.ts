export interface TimelineEventModel {
    id?: string,
    proposalId?: string,
    eventName: string,
    eventDescription?: string,
    eventType: string,
    deadlineDate?: Array<number>,
    completedDate?: Array<number>,
    daysOverDue?: number,
    isOverDue?: boolean
    stateName?: string,
    isAssociatedToState?: boolean
}