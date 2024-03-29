package isel.casciffo.casciffospringbackend.endpoints

const val API_URL = "/api/casciffo"
const val ENDPOINTS_URL = "$API_URL/"

/************************************** ROLES ******************************************/
/***************************************************************************************/

const val ROLES_URL = "$API_URL/roles"
const val ROLE_DELETE_URL = "$ROLES_URL/{roleId}"


/************************************** USERS ******************************************/
/***************************************************************************************/

const val USERS_URL = "$API_URL/users"
const val LOGIN_URL = "$USERS_URL/login"

/**
 * Url for self-created accounts
 */
const val REGISTER_URL = "$USERS_URL/register"
const val USER_DETAIL_URL = "$USERS_URL/{userId}"
const val USER_ROLES_URL = "$USER_DETAIL_URL/roles"
const val USER_SEARCH_URL = "$USERS_URL/search"

/**
 * Url for manually creating user accounts
 */
const val REGISTER_USER_SEPARATE_URL = "$USERS_URL/create"


/*********************************** NOTIFICATIONS *****************************************/
/***************************************************************************************/

const val USER_NOTIFICATIONS_URL = "$USERS_URL/{userId}/notifications"
const val USER_NOTIFICATIONS_CHECK_URL = "$USERS_URL/{userId}/notifications/check"

/*********************************** CONSTANTS *****************************************/
/***************************************************************************************/

const val CONSTANTS_URL = "$API_URL/constants"

const val SERVICE_TYPE_URL = "$CONSTANTS_URL/service-types"
const val THERAPEUTIC_AREA_URL = "$CONSTANTS_URL/therapeutic-areas"
const val PATHOLOGY_URL = "$CONSTANTS_URL/pathologies"

const val PATHOLOGY_DETAIL_URL = "$PATHOLOGY_URL/{pathologyId}"
const val SERVICE_TYPE_DETAIL_URL = "$SERVICE_TYPE_URL/{serviceTypeId}"
const val THERAPEUTIC_AREA_DETAIL_URL = "$THERAPEUTIC_AREA_URL/{therapeuticAreaId}"


/************************************ STATES *******************************************/
/***************************************************************************************/

const val STATES_URL = "$API_URL/states"
const val STATES_CHAIN_TYPE_URL = "$STATES_URL/{chainType}"

/*********************************** PROPOSAL ******************************************/
/***************************************************************************************/

const val PROPOSALS_URL = "$API_URL/proposals"
const val PROPOSALS_COUNT_URL = "$PROPOSALS_URL/count"


const val PROPOSALS_LASTEST_MODIFIED_URL = "$PROPOSALS_URL/last_modified"

const val PROPOSAL_URL = "$PROPOSALS_URL/{proposalId}"
const val PROPOSAL_DETAILS_FILE_UPLOAD_URL = "$PROPOSAL_URL/file-upload"
const val PROPOSAL_DETAILS_FILE_URL = "$PROPOSAL_URL/files/{fileId}"
const val PROPOSAL_DETAILS_FILE_DOWNLOAD_URL = "$PROPOSAL_DETAILS_FILE_URL/download"


const val PROPOSAL_COMMENTS_URL = "$PROPOSAL_URL/comments"
const val PROPOSAL_COMMENTS_DETAIL_URL = "$PROPOSAL_COMMENTS_URL/{cId}"

const val PROPOSAL_TRANSITION_URL = "$PROPOSAL_URL/state"

const val PROPOSAL_VALIDATION_URL = "$PROPOSAL_URL/validate"
const val PROPOSAL_FINANCE_VALIDATION_URL = "$PROPOSAL_VALIDATION_URL/{pfcId}/finance_dep"
const val PROPOSAL_JURIDICAL_VALIDATION_URL = "$PROPOSAL_VALIDATION_URL/{pfcId}/juridical_dep"

const val PROPOSAL_EVENTS_URL = "$PROPOSAL_URL/events"

const val PROPOSAL_COMPLETE_EVENTS_URL = "$PROPOSAL_EVENTS_URL/{eventId}" //?complete=true
const val PROPOSAL_PROTOCOL_URL = "$PROPOSAL_URL/pfc/{pfcId}/protocol"

const val PROPOSAL_FINANCIAL_FILE_UPLOAD_URL = "$PROPOSAL_URL/pfc/{pfcId}/upload"
const val PROPOSAL_FINANCIAL_FILE_DOWNLOAD_URL = "$PROPOSAL_URL/pfc/{pfcId}/download"

const val PROPOSAL_GENERAL_STATS_URL = "$PROPOSALS_URL/stats"

/*********************************** EVENTS ******************************************/
/***************************************************************************************/

const val NEAREST_EVENTS_URL = "$API_URL/events"

/*********************************** RESEARCH ******************************************/
/***************************************************************************************/
const val RESEARCH_URL = "$API_URL/research"
const val RESEARCH_COUNT_URL = "$RESEARCH_URL/count"
const val RESEARCH_LATEST_MODIFIED_URL = "$RESEARCH_URL/last_modified"
const val RESEARCH_DETAIL_URL = "$RESEARCH_URL/{researchId}"
const val RESEARCH_COMPLETE_URL = "$RESEARCH_URL/{researchId}/complete"
const val RESEARCH_CANCEL_URL = "$RESEARCH_URL/{researchId}/cancel"
const val ADDENDA_URL = "$RESEARCH_DETAIL_URL/addenda"
const val ADDENDA_DETAIL_URL = "$ADDENDA_URL/{addendaId}"
const val ADDENDA_DETAIL_STATE_URL = "$ADDENDA_URL/{addendaId}/state"
const val ADDENDA_DETAIL_STATE_CANCEL_URL = "$ADDENDA_DETAIL_STATE_URL/cancel"
const val ADDENDA_DETAIL_FILE_URL = "$ADDENDA_DETAIL_URL/file"
const val ADDENDA_DETAIL_COMMENTS_URL = "$ADDENDA_DETAIL_URL/comments"
const val RESEARCH_STUDIES_URL = "$RESEARCH_DETAIL_URL/studies"
const val RESEARCH_VISIT_URL = "$RESEARCH_DETAIL_URL/visits"
const val RESEARCH_VISIT_WITH_PATIENT_URL = "$RESEARCH_DETAIL_URL/visits-n-patient"
const val RESEARCH_VISIT_DETAIL_URL = "$RESEARCH_DETAIL_URL/visits/{visitId}"
const val RESEARCH_PATIENTS_URL = "$RESEARCH_DETAIL_URL/patients"
const val RESEARCH_PATIENTS_RANDOMIZE_URL = "$RESEARCH_PATIENTS_URL/randomize"
const val RESEARCH_VISIT_PATIENTS_URL = "$RESEARCH_PATIENTS_URL/{patientId}/visits"
const val RESEARCH_DOSSIER_URL = "$RESEARCH_DETAIL_URL/dossier"
const val RESEARCH_DOSSIER_DETAIL_URL = "$RESEARCH_DOSSIER_URL/{dossierId}"
const val RESEARCH_PATIENT_DETAILS_URL = "$RESEARCH_PATIENTS_URL/{patientProcessNum}"
const val RESEARCH_FINANCE_URL = "$RESEARCH_DETAIL_URL/finance"
const val RESEARCH_FINANCE_TEAM_ENTRY_URL = "$RESEARCH_FINANCE_URL/team-entry"
const val RESEARCH_FINANCE_RESEARCH_ENTRY_URL = "$RESEARCH_FINANCE_URL/research-entry"
const val RESEARCH_GENERAL_STATS_URL = "$RESEARCH_URL/stats"


/*********************************** PATIENTS ******************************************/
/***************************************************************************************/
const val SEARCH_PATIENTS_URL = "$API_URL/patients/search"
const val PATIENTS_URL = "$API_URL/patients"
const val PATIENTS_DETAIL_URL = "$PATIENTS_URL/{patientId}"
const val PATIENTS_DETAIL_VISITS_URL = "$PATIENTS_DETAIL_URL/visits"
