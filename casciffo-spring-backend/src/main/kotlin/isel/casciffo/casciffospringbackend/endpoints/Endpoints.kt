package isel.casciffo.casciffospringbackend.endpoints

const val ENDPOINTS_URL = "/"

/************************************** ROLES ******************************************/
/***************************************************************************************/

const val ROLES_URL = "/roles"
const val ROLE_DELETE_URL = "$ROLES_URL/{roleId}"


/************************************** USERS ******************************************/
/***************************************************************************************/

const val USERS_URL = "/users"
const val LOGIN_URL = "$USERS_URL/login"
const val REGISTER_URL = "$USERS_URL/register"
const val USER_DETAIL_URL = "$USERS_URL/{userId}"
const val USER_ROLES_URL = "$USER_DETAIL_URL/roles"
const val USER_SEARCH_URL = "$USERS_URL/search"


/*********************************** CONSTANTS *****************************************/
/***************************************************************************************/

const val CONSTANTS_URL = "/constants"

const val SERVICE_TYPE_URL = "$CONSTANTS_URL/service"
const val THERAPEUTIC_AREA_URL = "$CONSTANTS_URL/therapeutic-area"
const val PATHOLOGY_URL = "$CONSTANTS_URL/pathology"


/************************************ STATES *******************************************/
/***************************************************************************************/

const val STATES_URL = "/states"
const val STATES_CHAIN_TYPE_URL = "$STATES_URL/{chainType}"

/*********************************** PROPOSAL ******************************************/
/***************************************************************************************/

const val PROPOSALS_URL = "/proposals"

const val PROPOSAL_URL = "$PROPOSALS_URL/{proposalId}"

val buildGetProposalUrl = { id: Int -> "/${PROPOSALS_URL}/${id}"}

const val PROPOSAL_COMMENTS_URL = "$PROPOSAL_URL/comments"
const val PROPOSAL_COMMENTS_DETAIL_URL = "$PROPOSAL_COMMENTS_URL/{cId}"

val buildSingleCommentUrl = {id: Int -> "${PROPOSAL_URL}/comments/${id}"}

//role-based endpoints to advance certains parts of the state of a proposal
const val PROPOSAL_TRANSITION_URL = "$PROPOSAL_URL/state"
const val PROPOSAL_TRANSITION_SUPERUSER_URL = "$PROPOSAL_TRANSITION_URL/superuser"
const val PROPOSAL_TRANSITION_CA_URL = "$PROPOSAL_TRANSITION_URL/ca"
const val PROPOSAL_TRANSITION_UIC_URL = "$PROPOSAL_TRANSITION_URL/uic"

const val PROPOSAL_VALIDATION_URL = "$PROPOSAL_URL/validate"
const val PROPOSAL_FINANCE_VALIDATION_URL = "$PROPOSAL_VALIDATION_URL/{pfcId}/finance_dep"
const val PROPOSAL_JURIDICAL_VALIDATION_URL = "$PROPOSAL_VALIDATION_URL/{pfcId}/juridical_dep"

const val PROPOSAL_EVENTS_URL = "$PROPOSAL_URL/events"

const val PROPOSAL_COMPLETE_EVENTS_URL = "$PROPOSAL_EVENTS_URL/{eventId}" //?complete=true
const val PROPOSAL_PROTOCOL_URL = "$PROPOSAL_URL/pfc/{pfcId}/protocol"

const val PROPOSAL_FINANCIAL_FILE_UPLOAD_URL = "$PROPOSAL_URL/pfc/{pfcId}/upload"
const val PROPOSAL_FINANCIAL_FILE_DOWNLOAD_URL = "$PROPOSAL_URL/pfc/{pfcId}/download"

/*********************************** RESEARCH ******************************************/
/***************************************************************************************/

const val RESEARCHES_URL = "/research"

const val RESEARCH_URL = "${RESEARCHES_URL}/{researchId}"

val buildGetResearchUrl = { id: Int -> "/${RESEARCHES_URL}/${id}"}

const val POST_ADDENDA_URL = "${RESEARCH_URL}/addenda"
const val GET_ADDENDA_URL = "${POST_ADDENDA_URL}/{addendaId}"

const val RESEARCH_STUDIES_URL = "${RESEARCH_URL}/studies"

const val RESEARCH_VISIT_URL = "${RESEARCH_URL}/visits"

const val RESEARCH_PARTICIPANTS = "${RESEARCH_URL}/participants"

const val RESEARCH_VISIT_PATIENTS = "${RESEARCH_VISIT_URL}/{patientId}"
