const BASE_URL = `http://localhost:8080/api/casciffo`

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
const PROPOSALS_URL = `${BASE_URL}/proposals`
const DETAIL_PROPOSAL_URL = (id: string) => `${PROPOSALS_URL}/${id}`


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
    buildDetailProposalUrl: DETAIL_PROPOSAL_URL,
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
    usersByRoleAndNameUrl: USERS_BY_ROLE_AND_NAME
}

export default ApiUrls