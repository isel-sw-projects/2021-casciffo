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

type Partnership = {
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

export type {Page, APIResponse, ResearchType, Investigator, Partnership, Constants}