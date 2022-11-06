export interface NotificationModel {
    id?: number
    userId?: string
    title?: string
    description?: string
    //TODO DETAILS LINK NEEDS A WAY TO BE BUILT, BACK-END ISNT SUPPOSED TO KNOW FRONT-END ENDPOINTS
    // THEREFORE NOTIFICATION MODEL SHOULD HOLD AN ENUM WITH SUFFICIENT INFO
    // TO PERMIT FRONT-END TO BUILD THE APPROPRIATE LINK.
    // i.e {type: PROPOSAL_DETAILS, ids: {proposalId: 1}
    detailsLink?: string
    viewed?: boolean
}