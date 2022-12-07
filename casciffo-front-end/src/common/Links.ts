const BASE_URL = `/api/casciffo` //for single jar bundle
// const BASE_URL = `http://localhost:8080/api/casciffo` //for separate development
// const BASE_URL = `https://casciffo-back-end.herokuapp.com/api/casciffo` //for heroku

/************************** USER **************************/
const USERS_URL = `${BASE_URL}/users`
const USER_LOGIN_URL = `${USERS_URL}/login`
const USER_REGISTER_URL = `${USERS_URL}/register`
const USERS_CREATE_URL = `${USERS_URL}/create`
const USERS_BY_ROLE_URL = (roles: string[]) => `${USERS_URL}/search?roles=${roles}`
const USERS_BY_ROLE_AND_NAME = (name: string, roles: string[]) => `${USERS_BY_ROLE_URL(roles)}&name=${name}`

const USERS_BY_NAME_URL = (name: string) => `${USERS_URL}/search?name=${name}`

/************************** USER NOTIFICATIONS **************************/

const USER_NOTIFICATIONS_URL = (userId: string) => `${USERS_URL}/${userId}/notifications`
const USER_NOTIFICATIONS_CHECK_URL = (userId: string) => `${USERS_URL}/${userId}/notifications/check`

/************************** ROLE **************************/
const ROLES_URL = `${BASE_URL}/roles`
const USER_ROLES = (userId: string) => `${USERS_URL}/${userId}/roles`

/************************** STATE **************************/
const STATES_URL = `${BASE_URL}/states`
const STATES_CHAIN_URL = (type: string) => `${STATES_URL}/${type}`
// const STATES_CHAIN_BY_RESEARCH_ID = (researchId: string) => `${STATES_CHAIN_URL}`

/************************** PROPOSAL **************************/
const PROPOSALS_URL =  `${BASE_URL}/proposals`
const PROPOSALS_COUNT_URL =  `${PROPOSALS_URL}/count`
const PROPOSALS_BY_TYPE_URL = (type: string) => `${PROPOSALS_URL}?type=${type}`
const DETAIL_PROPOSAL_URL = (id: string) => `${PROPOSALS_URL}/${id}`
const PROPOSAL_TRANSITION_URL = (id: string, nextId: string) => `${DETAIL_PROPOSAL_URL(id)}/state?nextStateId=${nextId}`
const PROPOSALS_TIMELINE_EVENT_URL = (id: string) => `${DETAIL_PROPOSAL_URL(id)}/events`
const PROPOSALS_TIMELINE_EVENT_COMPLETE_URL =
    (id: string, eventId: string, complete: boolean) => `${DETAIL_PROPOSAL_URL(id)}/events/${eventId}?complete=${complete}`

const PROPOSAL_CF_UPLOAD = (pId: string, pfcId: string) => `${DETAIL_PROPOSAL_URL(pId)}/pfc/${pfcId}/upload`
const PROPOSAL_CF_DOWNLOAD = (pId: string, pfcId: string) => `${DETAIL_PROPOSAL_URL(pId)}/pfc/${pfcId}/download`

const PROPOSAL_STATS_URL = () => `${PROPOSALS_URL}/stats`
const PROPOSAL_LAST_MODIFIED_URL = () => `${PROPOSALS_URL}/last_modified`

/******************** PROPOSAL COMMENTS ***********************/
const COMMENTS_URL = (pId: string) => `${DETAIL_PROPOSAL_URL(pId)}/comments`
const COMMENTS_BY_TYPE_URL = (pId: string, type: string) => `${COMMENTS_URL(pId)}?t=${type}`

const PROPOSAL_VALIDATION_URL =
    (pId: string, pfcId: string, type: string) => `${DETAIL_PROPOSAL_URL(pId)}/validate/${pfcId}/${type}`

/************************** PROTOCOL ***************************/
const PROPOSAL_PROTOCOL_BASE = (pId: string, pfcId: string) => `${DETAIL_PROPOSAL_URL(pId)}/pfc/${pfcId}`
const PROPOSAL_PROTOCOL = (pId: string, pfcId: string) => `${PROPOSAL_PROTOCOL_BASE(pId, pfcId)}/protocol`

/************************** EVENTS **************************/
const NEAREST_EVENTS_URL = (t: string) =>  `${BASE_URL}/events?t=${t}`

/************************** CONSTANTS **************************/
const CONSTANTS_URL = `${BASE_URL}/constants`
const SERVICE_TYPES_URL = `${BASE_URL}/service-types`
const THERAPEUTIC_AREAS_URL = `${BASE_URL}/therapeutic-areas`
const PATHOLOGIES_URL = `${BASE_URL}/pathologies`


/************************** RESEARCH **************************/
const RESEARCH_URL = `${BASE_URL}/research`
const RESEARCH_COUNT_URL =  `${RESEARCH_URL}/count`
const RESEARCH_BY_TYPE_URL = (type: string) => `${RESEARCH_URL}?type=${type}`
const DETAIL_RESEARCH_URL = (id: string) => `${RESEARCH_URL}/${id}`
const COMPLETE_RESEARCH_URL = (id: string) => `${DETAIL_RESEARCH_URL(id)}/complete`
const CANCEL_RESEARCH_URL = (id: string) => `${DETAIL_RESEARCH_URL(id)}/cancel`
const DOSSIER_RESEARCH_URL = (id: string) => `${DETAIL_RESEARCH_URL(id)}/dossier`
const STUDIES_RESEARCH_URL = (id: string) => `${DETAIL_RESEARCH_URL(id)}/studies`
const VISITS_RESEARCH_URL = (id: string) => `${DETAIL_RESEARCH_URL(id)}/visits`
const PATIENT_WITH_VISITS_URL = (id: string) => `${DETAIL_RESEARCH_URL(id)}/visits-n-patient`
const VISIT_DETAILS_URL = (rId: string, vId: string) => `${VISITS_RESEARCH_URL(rId)}/${vId}`
const PATIENTS_RESEARCH_URL = (id: string) => `${DETAIL_RESEARCH_URL(id)}/patients`
// const RESEARCH_PATIENT_WITH_VISITS_URL = (id: string) => `${DETAIL_RESEARCH_URL(id)}/patients/create`
const RESEARCH_PATIENT_DETAIL_URL = (rId: string, pId: string) => `${PATIENTS_RESEARCH_URL(rId)}/${pId}`
const RESEARCH_FINANCE_URL = (id: string) => `${DETAIL_RESEARCH_URL(id)}/finance`

const PATIENTS_LIKE_URL = (processId: string) => `${BASE_URL}/patients/search?q=${processId}`
const RANDOMIZE_PATIENTS = (researchId: string) => `${PATIENTS_RESEARCH_URL(researchId)}/randomize`

const researchFinanceEntryUrl = (researchId: string) => `${RESEARCH_FINANCE_URL(researchId)}/research-entry`
const researchFinanceTeamEntryUrl = (researchId: string)  => `${RESEARCH_FINANCE_URL(researchId)}/team-entry`

const RESEARCH_STATS_URL = () => `${RESEARCH_URL}/stats`
const RESEARCH_LAST_MODIFIED_URL = () => `${RESEARCH_URL}/last_modified`

const ApiUrls = {
    baseUrl: BASE_URL,
    commentsUrl: COMMENTS_URL,
    commentsByTypeUrl: COMMENTS_BY_TYPE_URL,
    researchUrl: RESEARCH_URL,
    researchCountUrl: RESEARCH_COUNT_URL,
    researchDetailUrl: DETAIL_RESEARCH_URL,
    researchCompleteUrl: COMPLETE_RESEARCH_URL,
    researchCancelUrl: CANCEL_RESEARCH_URL,
    researchDossierUrl: DOSSIER_RESEARCH_URL,
    researchByTypeUrl: RESEARCH_BY_TYPE_URL,
    researchPatientsUrl: PATIENTS_RESEARCH_URL,
    researchStudiesUrl: STUDIES_RESEARCH_URL,
    researchVisitsUrl: VISITS_RESEARCH_URL,
    researchVisitDetailsUrl: VISIT_DETAILS_URL,
    // researchPatientsVisitsUrl: RESEARCH_PATIENT_WITH_VISITS_URL,
    researchPatientDetailUrl: RESEARCH_PATIENT_DETAIL_URL,
    researchPatientsRandomize: RANDOMIZE_PATIENTS,
    researchFinanceUrl: RESEARCH_FINANCE_URL,
    researchFinanceEntryUrl,
    researchFinanceTeamEntryUrl,
    researchStatsUrl: RESEARCH_STATS_URL,
    researchLatestModifiedUrl: RESEARCH_LAST_MODIFIED_URL,
    patientWithVisitsUrl: PATIENT_WITH_VISITS_URL,
    usersUrl: USERS_URL,
    userLoginUrl: USER_LOGIN_URL,
    userRegisterUrl: USER_REGISTER_URL,
    usersByRoleUrl: USERS_BY_ROLE_URL,
    usersByNameUrl: USERS_BY_NAME_URL,
    rolesUrl: ROLES_URL,
    statesUrl: STATES_URL,
    constantsUrl: CONSTANTS_URL,
    serviceTypesUrl: SERVICE_TYPES_URL,
    pathologiesUrl: PATHOLOGIES_URL,
    therapeuticAreasUrl: THERAPEUTIC_AREAS_URL,
    usersByRoleAndNameUrl: USERS_BY_ROLE_AND_NAME,
    proposalsUrl: PROPOSALS_URL,
    proposalsCountUrl: PROPOSALS_COUNT_URL,
    proposalsByTypeUrl: PROPOSALS_BY_TYPE_URL,
    buildDetailProposalUrl: DETAIL_PROPOSAL_URL,
    proposalsTransitionUrl: PROPOSAL_TRANSITION_URL,
    proposalsTimelineEventUrl: PROPOSALS_TIMELINE_EVENT_URL,
    proposalsTimelineEventUpdateUrl: PROPOSALS_TIMELINE_EVENT_COMPLETE_URL,
    proposalsProtocol: PROPOSAL_PROTOCOL,
    proposalDownloadCF: PROPOSAL_CF_DOWNLOAD,
    proposalUploadCF: PROPOSAL_CF_UPLOAD,
    proposalStatsUrl: PROPOSAL_STATS_URL,
    proposalValidationUrl: PROPOSAL_VALIDATION_URL,
    proposalLatestModifiedUrl: PROPOSAL_LAST_MODIFIED_URL,
    statesChainUrl: STATES_CHAIN_URL,
    userRolesUrl: USER_ROLES,
    usersCreateUrl: USERS_CREATE_URL,
    // statesChainByIdUrl: STATES_CHAIN_BY_RESEARCH_ID
    patientsLikeUrl: PATIENTS_LIKE_URL,
    nearestEventsUrl: NEAREST_EVENTS_URL,
    userNotifications: USER_NOTIFICATIONS_URL,
    userNotificationsCheck: USER_NOTIFICATIONS_CHECK_URL
}

export default ApiUrls
