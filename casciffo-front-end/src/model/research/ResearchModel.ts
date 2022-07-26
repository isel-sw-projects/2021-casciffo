import {ProposalModel} from "../proposal/ProposalModel";
import UserModel from "../user/UserModel";

export interface ResearchModel {
    id?: string
    stateId?: string
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
    proposalId?: string
    proposal?: ProposalModel
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