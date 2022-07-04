import {ProposalCommentsModel} from "../ProposalCommentsModel";

export interface ProtocolModel {
    id?: string,
    validatedDate?: string,
    validated?: boolean,
    financialComponentId?: number,
    commentRef?: string
}

export interface ProtocolAggregateDTO {
    protocol?: ProtocolModel,
    comment?: ProposalCommentsModel
}