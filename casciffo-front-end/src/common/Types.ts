import {Track} from "../model/Track";
import {PathologyModel} from "../model/constants/PathologyModel";
import {ServiceTypeModel} from "../model/constants/ServiceTypeModel";
import {TherapeuticAreaModel} from "../model/constants/TherapeuticAreaModel";

type Page = {
    pageNum: number,
    elementsLimit: number,
    searchQuery: string
}

type APIResponse = {
    tracks: Array<Track>,
    totalTracks: number
}

type ResearchType = {
    name: string,
    id: string
}

type Investigator = {
    name: string,
    pid: string,
    teamRole: string
}

type Promoter = {
    promoterName: string,
    promoterEmail: string,
    promoterType: string
}

type ProposalForm = {
    sigla: string,
    serviceId: number,
    therapeuticAreaId: number,
    pathologyId: number,
    pInvestigator: Investigator,
    researchType: string,
    promoter: Promoter,
    team: Array<Investigator>,
    partnerships: Array<Partnership>,
    file?: File
}

interface Partnership {
    id?: number,
    partnershipName: string,
    partnershipWebsite: string,
    partnershipRepresentative: string,
    partnershipContact: string,
    partnershipEmail: string,
    partnershipDescription: string
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

export type {Page, APIResponse, ResearchType, Investigator, Partnership, Constants, Filter, ProposalForm, Promoter}