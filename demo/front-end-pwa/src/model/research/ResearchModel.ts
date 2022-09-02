import {ProposalModel} from "../proposal/ProposalModel";
import {StateTransitionModel} from "../state/StateTransitionModel";
import {StateModel} from "../state/StateModel";
import UserModel from "../user/UserModel";
import {TeamInvestigatorModel} from "../TeamInvestigatorModel";


export interface ResearchModel {
    id?: string
    eudra_ct?: string
    sampleSize?: string
    duration?: string
    cro?: string
    startDate?: string
    endDate?: string
    estimatedEndDate?: string
    estimatedPatientPool?: string
    actualPatientPool?: string
    industry?: string
    protocol?: string
    initiativeBy?: string
    phase?: string
    type?: string
    treatmentType?: string
    typology?: string
    specification?: string
    stateId?: string
    state?: StateModel
    proposalId?: string
    proposal?: ProposalModel
    visits?: ResearchVisitModel[]
    stateTransitions?: StateTransitionModel[]
    dossiers?: DossierModel[]
    patients?: PatientModel[]
    scientificActivities?: ScientificActivityModel[]
    investigationTeam?: TeamInvestigatorModel[]
}

export interface ResearchAggregateModel {
    id?: string
    eudra_ct?: string
    sampleSize?: string
    duration?: string
    cro?: string
    startDate?: string
    endDate?: string
    estimatedEndDate?: string
    industry?: string
    protocol?: string
    initiativeBy?: string
    phase?: string
    type?: string
    stateId?: string
    stateName?: string
    proposalId?: string
    sigla?: string
    serviceName?: string
    serviceId?: string
    therapeuticAreaName?: string
    therapeuticAreaId?: string
    pathologyName?: string
    pathologyId?: string
    principalInvestigatorId?: string
    principalInvestigatorName?: string
    principalInvestigatorEmail?: string
    promoterName?: string
}

export interface DossierModel {
    id?: number
    clinicalResearchId?: string
    volume?: string
    label?: string
    amount?: number
}

export interface ResearchVisitModel {
    id?: string
    researchId?: string
    participantId?: string
    concluded?: boolean;
    visitType?: string
    scheduledDate?: string
    startDate?: string
    endDate?: string
    periodicity?: string
    observations?: string
    hasAdverseEventAlert?: boolean
    hasMarkedAttendance?: boolean
    patient?: PatientModel
    visitInvestigators?: VisitInvestigator[]
}

export interface VisitInvestigator {
    id?: string
    visitId?: string
    investigatorId?: string
    investigator?: UserModel
}

export interface PatientModel {
    id?: string
    processId?: string
    fullName?: string
    gender?: string
    age?: string
    joinDate?: string
    lastVisitDate?: string
    treatmentBranch?: string
}

export interface PatientVisitsAggregate {
    patient: PatientModel
    scheduledVisits: ResearchVisitModel[]
}

export interface ScientificActivityModel {
    id?: string
    researchId?: string
    datePublished?: string
    author?: string
    paperName?: string
    volume?: string
    volumeNumber?: string
    paperNumPages?: string
    countryPublished?: string
    hasBeenIndexed?: boolean
    publishedUrl?: string
    publicationType?: string
    studyType?: string
}
