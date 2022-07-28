import {ProposalModel} from "../proposal/ProposalModel";
import {StateTransitionModel} from "../state/StateTransitionModel";
import {StateModel} from "../state/StateModel";


export interface ResearchModel {
    id?: string
    eudra_ct?: string
    sampleSize?: string
    duration?: string
    cro?: string
    startDate?: string
    endDate?: string
    estimatedEndDate?: string
    estimatedPatientPool?: string,
    actualPatientPool?: string,
    industry?: string
    protocol?: string
    initiativeBy?: string
    phase?: string
    type?: string
    stateId?: string
    state?: StateModel
    proposalId?: string
    proposal?: ProposalModel
    stateTransitions?: StateTransitionModel[]
    dossiers?: Dossier[]
    patients?: Patient[]
    scientificActivities?: ScientificActivity[]
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

export interface Dossier {
    id?: string
    clinicalResearchId?: string
    volume?: string
    label?: string
    amount?: number
}

export interface Patient {
    id?: string
    processId?: string
    fullName?: string
    gender?: string
    age?: string
}

export interface ScientificActivity {
    id?: string
    researchId?: string
    datePublished?: string
    author?: string
    paperName?: string
    volume?: string
    volumeNumber?: string
    paperNumPages?: string
    countryPublished?: string
    hasBeenIndexed?: string
    publishedUrl?: string
}
