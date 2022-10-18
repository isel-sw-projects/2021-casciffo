export const TeamRoleTypes = {
    MEMBER: "MEMBER",
    PRINCIPAL: "PRINCIPAL"
}

export const ResearchTypes = {
    CLINICAL_TRIAL: {name:"Ensaios Clínicos", id:"CLINICAL_TRIAL", singularName: "Ensaio Clínico"},
    OBSVERTIONAL_STUDY: {name:"Estudos Observacionais", id:"OBSERVATIONAL_STUDY", singularName: "Ensaio Observacional"}
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

export const PeriodicityTypes = {
    DAILY: {id: "DAILY", name : "Diário"},
    WEEKLY: {id: "WEEKLY", name : "Semanal"},
    MONTHLY: {id: "MONTHLY", name : "Mensal"},
    NONE: {id: "NONE", name: "Sem periodicidade"},
    CUSTOM: {id: "CUSTOM", name: "Outro"}

}

export const TOKEN_KEY = "token"

export const KEY_VALUE_DELIMENTER = "="
export const PARAM_DELIMENTER = "&"
export const TAB_PARAMETER = "t"
export const SCOPE_PARAMETER = "s"
export const PATIENT_ID_PARAMETER = "pId"
export const VISIT_ID_PARAMETER = "vId"
export const ADDENDA_ID_PARAMETER = "aId"
