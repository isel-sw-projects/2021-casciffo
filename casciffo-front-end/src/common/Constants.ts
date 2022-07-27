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

export const TOKEN_KEY = "token"