import {MyHashMap} from "./Types";

export const NOT_AVAILABLE = "N/A"

export const TeamRoleTypes = {
    MEMBER: "MEMBER",
    PRINCIPAL: "PRINCIPAL"
}

export const ResearchTypes = {
    CLINICAL_TRIAL: {name:"Ensaios Clínicos", id:"CLINICAL_TRIAL", singularName: "Ensaio Clínico"},
    OBSERVATIONAL_STUDY: {name:"Estudos Observacionais", id:"OBSERVATIONAL_STUDY", singularName: "Ensaio Observacional"}
}

export const PromoterTypes = {
    INDUSTRY: {name:"Indústria", id:"INDUSTRY"},
    ACADEMIA: {name:"Academia", id:"ACADEMIA"},
    COMMERCIAL: {name:"Comercial (i.e Farmaceutico)", id:"COMMERCIAL"},
    NOT_COMMERCIAL: {name:"Não Comercial (i.e Académico)", id:"NOT_COMMERCIAL"},
    NOT_APPLICABLE: {name:"Não Aplicável", id:"NOT_APPLICABLE"}
}

export const CommentTypes = {
    CONTACT: {name: "Contacto", id:"CONTACTS"},
    OBSERVATIONS: {name: "Observação", id:"OBSERVATIONS"},
    PROTOCOL: {name: "Protocolo", id: "PROTOCOL"}
}

export const EventTypes = {
    DEADLINES: {name: "Deadlines", id: "DEADLINE"},
    STATES: {name: "Transições de estado", id: "STATE"},
    ALL: {name: "Tudo", id: "ALL"},
}

export const DepartmentTypes = {
    FINANCE: {name: "Financeiro", id: "FINANCE_DEP"},
    JURIDICAL: {name: "Jurídico", id: "JURIDICAL_DEP"},
    ALL: {name: "Todos", id: "ALL"},
}

export const StateChainTypes = {
    FINANCE_PROPOSAL: "FINANCE_PROPOSAL",
    STUDY_PROPOSAL: "STUDY_PROPOSAL",
    RESEARCH: "RESEARCH",
    ADDENDA: "ADDENDA",
    ALL: "ALL",
}

export const StateFlowTypes = {
    INITIAL: "INITIAL",
    PROGRESS: "PROGRESS",
    TERMINAL: "TERMINAL"
}

export const TypeOfMonetaryFlows = {
    CREDIT: {name: "Crédito", id: "CREDIT"},
    DEBIT: {name: "Débito", id:"DEBIT"}
}

export enum TabPaneScope {
    OVERVIEW, DETAILS, CREATE
}

export const VisitTypes = {
    MONITORING : {id: "MONITORING", name: "Monitorização"},
    CLOSEOUT : {id: "CLOSEOUT", name: "Closeout"},
    FIRST_VISIT : {id: "SCREENING", name: "Screening"},
}

export const VisitChrono = {
    ALL: {id: "ALL", name: "Todas as visitas"},
    HISTORY: {id: "HISTORY", name: "Histórico de visitas"},
    TO_HAPPEN: {id: "TO_HAPPEN", name: "Visitas agendadas"},
}

export const VisitPeriodicity = {
    DAILY: {id: "DAILY", name : "Diário"},
    WEEKLY: {id: "WEEKLY", name : "Semanal"},
    MONTHLY: {id: "MONTHLY", name : "Mensal"},
    NONE: {id: "NONE", name: "Sem periodicidade"},
    CUSTOM: {id: "CUSTOM", name: "Outro"}

}

export const ProposalTabNames = {
    proposal: "detalhes",
    proposal_cf: "contrato",
    contacts: "contactos",
    observations: "observacoes",
    partnerships: "parcerias",
    protocol: "protocolo",
    chronology: "cronologia",
}

export const ResearchTabNames = {
    research: "detalhes",
    addenda: "addenda",
    activities: "atividades",
    visits: "visitas",
    patients: "pacientes",
    finance: "financiamento"
}
export const DataTypesTabNames = {
    serviceType: "tipo-de-servico",
    pathology: "patologias",
    therapeuticArea: "areas-de-terapia",
    patients: "pacientes"
}


export const NotificationType = {
    PROPOSAL_SUBMITTED: {
        id: "PROPOSAL_SUBMITTED",
        buildLink: (ids: MyHashMap): string => `/propostas/${ids["proposalId"]}#t=${ProposalTabNames.proposal}`},
    PROPOSAL_DETAILS: {
        id: "PROPOSAL_DETAILS",
        buildLink: (ids: MyHashMap): string => `/propostas/${ids["proposalId"]}#t=${ProposalTabNames.proposal}`},
    PROPOSAL_FINANCE: {
        id: "PROPOSAL_FINANCE",
        buildLink: (ids: MyHashMap): string => `/propostas/${ids["proposalId"]}#t=${ProposalTabNames.proposal_cf}`},
    PROPOSAL_EVENTS: {
        id: "PROPOSAL_EVENTS",
        buildLink: (ids: MyHashMap): string => `/propostas/${ids["proposalId"]}#t=${ProposalTabNames.chronology}`},
    PROPOSAL_OBSERVATION: {
        id: "PROPOSAL_OBSERVATION",
        buildLink: (ids: MyHashMap): string => `/propostas/${ids["proposalId"]}#t=${ProposalTabNames.observations}`},
    PROPOSAL_CONTACT: {
        id: "PROPOSAL_CONTACT",
        buildLink: (ids: MyHashMap): string => `/propostas/${ids["proposalId"]}#t=${ProposalTabNames.contacts}`},
    RESEARCH_DETAILS: {
        id: "RESEARCH_DETAILS",
        buildLink: (ids: MyHashMap): string => `/ensaios/${ids["researchId"]}#${ResearchTabNames.research}`},
    RESEARCH_ADDENDA: {
        id: "RESEARCH_ADDENDA",
        buildLink: (ids: MyHashMap): string =>`/propostas/${ids["proposalId"]}#${ResearchTabNames.addenda}`},
    RESEARCH_VISIT: {
        id: "RESEARCH_VISIT",
        buildLink: (ids: MyHashMap): string => `/propostas/${ids["proposalId"]}#${ResearchTabNames.visits}`},
    USER_NEW_ROLES: {
        id: "USER_NEW_ROLES",
        buildLink: (ids: MyHashMap): string => NOT_AVAILABLE},
    USER_CREATED: {
        id: "USER_CREATED",
        buildLink: (ids: MyHashMap): string => `/utilizadores/${ids["userId"]}`
    }
}

export const SHORT_TIMEOUT_MILLIS = 1250
export const MEDIUM_TIMEOUT_MILLIS = 3000
export const LONG_TIMEOUT_MILLIS = 8000

export const NOTIFICATION_CHECK_INTERVAL_MINUTES = 10

export const TOKEN_KEY = "token"

export const KEY_VALUE_DELIMENTER = "="
export const PARAM_DELIMENTER = "&"
export const TAB_PARAMETER = "t"
export const SCOPE_PARAMETER = "s"
export const PATIENT_ID_PARAMETER = "pId"
export const VISIT_ID_PARAMETER = "vId"
export const ADDENDA_ID_PARAMETER = "aId"
