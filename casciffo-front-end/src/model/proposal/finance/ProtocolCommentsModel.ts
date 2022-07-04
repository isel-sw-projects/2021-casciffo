import {ProposalCommentsModel} from "../ProposalCommentsModel";

export interface ProtocolCommentsModel {
    newValidation?: boolean,
    validated?: boolean,
    comment?: ProposalCommentsModel
}