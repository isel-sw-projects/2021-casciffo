
import {PathologyModel} from "../model/proposal-constants/PathologyModel";
import {ServiceTypeModel} from "../model/proposal-constants/ServiceTypeModel";
import {TherapeuticAreaModel} from "../model/proposal-constants/TherapeuticAreaModel";
import {PromoterModel} from "../model/proposal/finance/PromoterModel";
import {PartnershipModel} from "../model/PartnershipModel";

type Page = {
    pageNum: number,
    elementsLimit: number,
    searchQuery: string
}

type ResearchType = {
    name: string,
    id: string
}

type Investigator = {
    name: string,
    id: string,
    email: string,
    teamRole: string
}

type Promoter = {
    promoterName: string,
    promoterEmail: string,
    promoterType: string
}

type ProposalForm = {
    sigla: string,
    serviceTypeId: number,
    therapeuticAreaId: number,
    pathologyId: number,
    pInvestigator: Investigator,
    researchType: string,
    promoter: PromoterModel,
    team: Array<Investigator>,
    partnerships: Array<PartnershipModel>,
    file?: File
}

type Constants = {
    pathologies: Array<PathologyModel>
    serviceTypes: Array<ServiceTypeModel>
    therapeuticAreas: Array<TherapeuticAreaModel>
}

type Filter = {
    value: string,
    id: string
}

export type {
    Page, ResearchType, Investigator,
    Constants, Filter, ProposalForm, Promoter
}