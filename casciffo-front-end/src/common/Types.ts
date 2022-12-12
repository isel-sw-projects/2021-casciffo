
import {PathologyModel} from "../model/proposal-constants/PathologyModel";
import {ServiceTypeModel} from "../model/proposal-constants/ServiceTypeModel";
import {TherapeuticAreaModel} from "../model/proposal-constants/TherapeuticAreaModel";
import {PromoterModel} from "../model/proposal/finance/PromoterModel";
import {PartnershipModel} from "../model/proposal/finance/PartnershipModel";
import {AxiosHeaders} from "axios";

type AxiosResponseBody = {
    data: any
    config: any
    headers: AxiosHeaders
    request: XMLHttpRequest
    status: number
    statusText: string
}

// type Page = {
//     pageNum: number,
//     elementsLimit: number,
//     searchQuery: string
// }
//
// type ResearchType = {
//     name: string,
//     id: string
// }

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
    team: Investigator[],
    partnerships: PartnershipModel[],
    file?: File
}

type ConstantsModel = {
    pathologies: PathologyModel[]
    serviceTypes: ServiceTypeModel[]
    therapeuticAreas: TherapeuticAreaModel[]
}


type Filter = {
    value: string,
    id: string
}

type UserToken = {
    token: string,
    userId: string,
    userName: string,
    roles: string[]
}

// type GeneralError = {
//     status: string,
//     message: string
// }

type KeyValuePair<K, V> = {
    key: K,
    value: V
}

type MyHashMap = {
    [key: string]: number
}

export type CSVHeader<T> = {
    label: string,
    key: keyof T
}

export type CountHolder = {
    trials: number,
    studies: number
}

export type {
    AxiosResponseBody,
    Investigator,
    ConstantsModel, Filter, ProposalForm, Promoter,
    UserToken, KeyValuePair, MyHashMap
}
