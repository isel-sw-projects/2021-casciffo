const BASE_URL = `http://localhost:8080/api/casciffo`
// const BASE_URL = `https://casciffo-back-end.herokuapp.com/api/casciffo`

/************************** USER **************************/
const USERS_URL = `${BASE_URL}/users`
const USERS_BY_ROLE = (roles: string[]) => `${USERS_URL}/search?roles=${roles}`
const USERS_BY_ROLE_AND_NAME =
    (name: string, roles: string[]) =>
        `${USERS_BY_ROLE(roles)}&name=${name}`

/************************** ROLE **************************/
const ROLES_URL = `${BASE_URL}/roles`


/************************** STATE **************************/
const STATES_URL = `${BASE_URL}/states`


/************************** PROPOSAL **************************/
const PROPOSALS_URL =  `${BASE_URL}/proposals`
const PROPOSALS_URL_BY_TYPE = (type: string) => `${PROPOSALS_URL}?type=${type}`
const DETAIL_PROPOSAL_URL = (id: string) => `${PROPOSALS_URL}/${id}`
const PROPOSAL_TRANSITION_URL = (id: string, forward: boolean) => `${DETAIL_PROPOSAL_URL(id)}/state?forward=${forward}`
const PROPOSALS_TIMELINE_EVENT_URL = (id: string) => `${DETAIL_PROPOSAL_URL(id)}/events`
const PROPOSALS_TIMELINE_EVENT_COMPLETE_URL =
    (id: string, eventId: string, complete: boolean) => `${DETAIL_PROPOSAL_URL(id)}/events/${eventId}?complete=${complete}`

/******************** PROPOSAL COMMENTS ***********************/
const COMMENTS_URL = (pId: string) => `${DETAIL_PROPOSAL_URL(pId)}/comments`
const COMMENTS_BY_TYPE_URL = (pId: string, type: string) => `${COMMENTS_URL(pId)}?t=${type}`


/************************** PROTOCOL ***************************/
const PROPOSAL_PROTOCOL_BASE = (pId: string, pfcId: string) => `${DETAIL_PROPOSAL_URL(pId)}/pfc/${pfcId}`
const PROPOSAL_PROTOCOL = (pId: string, pfcId: string) => `${PROPOSAL_PROTOCOL_BASE(pId, pfcId)}/protocol`
const PROPOSAL_PROTOCOL_COMMENTS = (pId: string, pfcId: string) => `${PROPOSAL_PROTOCOL_BASE(pId, pfcId)}/protocol-comments`


/************************** CONSTANTS **************************/
const CONSTANTS_URL = `${BASE_URL}/constants`
const SERVICE_TYPES_URL = `${BASE_URL}/service-types`
const THERAPEUTIC_AREAS_URL = `${BASE_URL}/therapeutic-areas`
const PATHOLOGIES_URL = `${BASE_URL}/pathologies`


/************************** RESEARCH **************************/
const RESEARCH_URL = `${BASE_URL}/research`
const DETAIL_RESEARCH_URL = (id: string) => `${RESEARCH_URL}/${id}`



const ApiUrls = {
    baseUrl: BASE_URL,
    proposalsUrl: PROPOSALS_URL,
    proposalsByTypeUrl: PROPOSALS_URL_BY_TYPE,
    buildDetailProposalUrl: DETAIL_PROPOSAL_URL,
    commentsUrl: COMMENTS_URL,
    commentsByTypeUrl: COMMENTS_BY_TYPE_URL,
    researchUrl: RESEARCH_URL,
    buildDetailResearchUrl: DETAIL_RESEARCH_URL,
    usersUrl: USERS_URL,
    usersByRoleUrl: USERS_BY_ROLE,
    rolesUrl: ROLES_URL,
    statesUrl: STATES_URL,
    constantsUrl: CONSTANTS_URL,
    serviceTypesUrl: SERVICE_TYPES_URL,
    pathologiesUrl: PATHOLOGIES_URL,
    therapeuticAreasUrl: THERAPEUTIC_AREAS_URL,
    usersByRoleAndNameUrl: USERS_BY_ROLE_AND_NAME,
    proposalsTransitionUrl: PROPOSAL_TRANSITION_URL,
    proposalsTimelineEventUrl: PROPOSALS_TIMELINE_EVENT_URL,
    proposalsTimelineEventUpdateUrl: PROPOSALS_TIMELINE_EVENT_COMPLETE_URL,
    proposalsProtocol: PROPOSAL_PROTOCOL,
    proposalsProtocolComments: PROPOSAL_PROTOCOL_COMMENTS
}

export default ApiUrls