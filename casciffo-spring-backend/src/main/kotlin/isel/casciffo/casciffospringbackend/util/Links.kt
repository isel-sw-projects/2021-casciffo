package isel.casciffo.casciffospringbackend.util


/************************************** ROLES ******************************************/
/***************************************************************************************/

const val USER_ROLE_BASE_URL = "/roles"

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

const val PROPOSAL_URI = "${PROPOSAL_BASE_URL}/{proposalId}"

val buildGetProposalUrl = { id: Int -> "/${PROPOSAL_BASE_URL}/${id}"}

const val PROPOSAL_COMMENTS = "${PROPOSAL_URI}/comments"

val buildSingleCommentUrl = {id: Int -> "${PROPOSAL_URI}/comments/${id}"}


/*********************************** RESEARCH ******************************************/
/***************************************************************************************/

const val RESEARCH_BASE_URL = "/research"

const val RESEARCH_URI = "${RESEARCH_BASE_URL}/{researchId}"

val buildGetResearchUrl = { id: Int -> "/${RESEARCH_BASE_URL}/${id}"}

const val POST_ADDENDA_URI = "${RESEARCH_URI}/addenda"
const val GET_ADDENDA_URI = "${POST_ADDENDA_URI}/{addendaId}"

const val RESEARCH_STUDIES_URI = "${RESEARCH_URI}/studies"

const val RESEARCH_VISIT_URL = "${RESEARCH_URI}/visits"

const val RESEARCH_PARTICIPANTS = "${RESEARCH_URI}/participants"

const val RESEARCH_VISIT_PATIENTS = "${RESEARCH_VISIT_URL}/{patientId}"
