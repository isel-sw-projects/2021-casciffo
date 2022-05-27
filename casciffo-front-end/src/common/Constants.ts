const TeamRoleTypes = {
    MEMBER: "MEMBER",
    PRINCIPAL: "PRINCIPAL"
}

const ResearchTypes = {
    CLINICAL_TRIAL: {name:"Ensaios Clínicos", id:"CLINICAL_TRIAL"},
    OBSVERTIONAL_STUDY: {name:"Estudos Observacionais", id:"OBSERVATIONAL_STUDY"}
}

const PromoterTypes = {
    COMMERCIAL: {name:"Comercial (i.e Farmaceutico)", id:"COMMERCIAL"},
    NOT_COMMERCIAL: {name:"Não Comercial (i.e Académico)", id:"NOT_COMMERCIAL"}
}

const CommentTypes = {
    CONTACT: {name: "Contacto", id:"CONTACTS"},
    OBSERVATIONS: {name: "Observação", id:"OBSERVATIONS"}
}

const EventTypes = {
    DEADLINES: {name: "Deadlines", id: "DEADLINE"},
    STATES: {name: "Transições de estado", id: "STATE"},
    ALL: {name: "Tudo", id: "ALL"},
}

export {TeamRoleTypes, EventTypes, CommentTypes, ResearchTypes, PromoterTypes}