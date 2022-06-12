package isel.casciffo.casciffospringbackend.endpoints

/************************************** ROLES ******************************************/
/***************************************************************************************/

const val USER_ROLE_BASE_URL = "/roles"


/************************************** USERS ******************************************/
/***************************************************************************************/

const val USER_BASE_URL = "/users"
const val LOGIN_URL = "${USER_BASE_URL}/login"
const val REGISTER_URL = "${USER_BASE_URL}/register"
const val GET_USER_URL = "${USER_BASE_URL}/{userId}"
const val SEARCH_USER_URL = "${USER_BASE_URL}/search"


/*********************************** CONSTANTS *****************************************/
/***************************************************************************************/

const val CONSTANTS_BASE_URL = "/constants"

const val SERVICE_TYPE_URL = "${CONSTANTS_BASE_URL}/service"
const val THERAPEUTIC_AREA_URL = "${CONSTANTS_BASE_URL}/therapeuticArea"
const val PATHOLOGY_URL = "${CONSTANTS_BASE_URL}/pathology"


/************************************ STATES *******************************************/
/***************************************************************************************/

const val STATES_URL = "/states"

/*********************************** PROPOSAL ******************************************/
/***************************************************************************************/

const val PROPOSAL_BASE_URL = "/proposals"

const val PROPOSAL_URL = "${PROPOSAL_BASE_URL}/{proposalId}"

val buildGetProposalUrl = { id: Int -> "/${PROPOSAL_BASE_URL}/${id}"}

const val PROPOSAL_COMMENTS = "${PROPOSAL_URL}/comments"

val buildSingleCommentUrl = {id: Int -> "${PROPOSAL_URL}/comments/${id}"}

//TODO link these role-based endpoints to advance certains parts of the state of a proposal
const val PROPOSAL_TRANSITION_URL = "${PROPOSAL_URL}/state/superuser"
const val PROPOSAL_TRANSITION_SUPERUSER_URL = "${PROPOSAL_URL}/state/superuser"
const val PROPOSAL_TRANSITION_CA_URL = "${PROPOSAL_URL}/state/ca"
const val PROPOSAL_TRANSITION_UIC_URL = "${PROPOSAL_URL}/state/uic"
const val PROPOSAL_TRANSITION_FINANCE_URL = "${PROPOSAL_URL}/state/finance"

const val PROPOSAL_EVENTS_URL = "${PROPOSAL_URL}/events"

const val PROPOSAL_COMPLETE_EVENTS_URL = "${PROPOSAL_EVENTS_URL}/{eventId}" //?complete=true

const val PROPOSAL_PROTOCOL_URL = "${PROPOSAL_URL}/pfc/{pfcId}/protocol"

const val PROPOSAL_PROTOCOL_COMMENTS_URL = "${PROPOSAL_URL}/pfc/{pfcId}/protocol-comments"

/*********************************** RESEARCH ******************************************/
/***************************************************************************************/

const val RESEARCH_BASE_URL = "/research"

const val RESEARCH_URL = "${RESEARCH_BASE_URL}/{researchId}"

val buildGetResearchUrl = { id: Int -> "/${RESEARCH_BASE_URL}/${id}"}

const val POST_ADDENDA_URL = "${RESEARCH_URL}/addenda"
const val GET_ADDENDA_URL = "${POST_ADDENDA_URL}/{addendaId}"

const val RESEARCH_STUDIES_URL = "${RESEARCH_URL}/studies"

const val RESEARCH_VISIT_URL = "${RESEARCH_URL}/visits"

const val RESEARCH_PARTICIPANTS = "${RESEARCH_URL}/participants"

const val RESEARCH_VISIT_PATIENTS = "${RESEARCH_VISIT_URL}/{patientId}"
