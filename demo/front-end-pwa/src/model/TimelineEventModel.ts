export interface TimelineEventModel {
    id?: string,
    proposalId?: string,
    eventName: string,
    eventDescription?: string,
    eventType: string,
    deadlineDate?: string,
    completedDate?: string,
    daysOverDue?: number,
    isOverDue?: boolean
    stateName?: string,
    isAssociatedToState?: boolean
}