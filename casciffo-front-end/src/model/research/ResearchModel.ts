import {ProposalModel} from "../proposal/ProposalModel";
import {StateTransitionModel} from "../state/StateTransitionModel";
import {StateModel} from "../state/StateModel";
import UserModel from "../user/UserModel";
import {TeamInvestigatorModel} from "../user/TeamInvestigatorModel";
import {FileInfo} from "../proposal/finance/ProposalFinanceModel";


export interface ResearchModel {
    id?: string
    lastModified?: string
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
    treatmentBranches?: string // comes separated by ';'
    stateId?: string
    state?: StateModel
    proposalId?: string
    proposal?: ProposalModel
    visits?: ResearchVisitModel[]
    addendas?: ResearchAddenda[]
    stateTransitions?: StateTransitionModel[]
    dossiers?: DossierModel[]
    patients?: ResearchPatientModel[]
    scientificActivities?: ScientificActivityModel[]
    investigationTeam?: TeamInvestigatorModel[]
    financeComponent?: ResearchFinance
    canceledReason?: string
    canceledById?: string
    canceledBy?: UserModel
}

export interface ResearchAggregateModel {
    id?: string
    eudra_ct?: string
    sampleSize?: string
    lastModified?: string
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
    hasPartnerships?: boolean
}

export interface DossierModel {
    id?: string
    clinicalResearchId?: string
    volume?: string
    label?: string
    amount?: number
}

export interface ResearchVisitModel {
    id?: string
    researchId?: string
    researchPatientId?: string
    concluded?: boolean;
    visitType?: string
    scheduledDate?: string
    startDate?: string
    endDate?: string
    periodicity?: string
    customPeriodicity?: number
    observations?: string
    hasAdverseEventAlert?: boolean
    hasMarkedAttendance?: boolean
    researchPatient?: ResearchPatientModel
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
}

export interface ResearchPatientModel {
    id?: string
    patientId?: string,
    researchId?: string,
    joinDate?: string
    lastVisitDate?: string
    treatmentBranch?: string,
    patient?: PatientModel
}

export interface PatientVisitsAggregate {
    patient: PatientModel
    scheduledVisits: ResearchVisitModel[]
}

export interface ResearchPatientVisitsAggregate {
    researchPatient: ResearchPatientModel
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
    researchType?: string
}

export interface ResearchAddenda {
    id?: string
    researchId?: string
    stateId?: string
    fileId?: string
    createdDate?: string
    state?: StateModel
    stateTransitions?: StateTransitionModel[]
    observations?: AddendaCommentsModel[]
    fileInfo?: FileInfo
}

export interface AddendaCommentsModel {
    id?: string
    createdDate?: string
    addendaId?: string
    observation?: string
    authorId?: string
    authorName?: string
    author?: UserModel
}

export interface ResearchModelAnswer {
    research?: ResearchModel
    success?: boolean
}

export interface ResearchFinance {
    id?: string
    researchId?: string
    valuePerParticipant?: string
    roleValuePerParticipant?: string
    balance?: string
    teamFinanceFlow?: ResearchTeamFinanceEntry[]
    monetaryFlow?: ResearchFinanceEntry[]
}

export interface ResearchFinanceEntry {
    id?: string
    rfcId?: string
    transactionDate?: string
    typeOfMonetaryFlow?: string
    motive?: string
    amount?: string
}

export interface ResearchTeamFinanceEntry {
    id?: string
    rfcId?: string
    typeOfMonetaryFlow?: string
    transactionDate?: string
    responsibleForPayment?: string
    amount?: string
    partitionPercentage?: string
    roleAmount?: string
    investigatorId?: string
    investigator?: UserModel
}

export interface ResearchFinanceNewEntryDTO {
    id?: string
    researchId?: string
    valuePerParticipant?: string
    roleValuePerParticipant?: string
    balance?: string
    newMonetaryEntry?: ResearchFinanceEntry
    newTeamFinanceEnty?: ResearchTeamFinanceEntry
}