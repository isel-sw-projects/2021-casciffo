import {ProposalCommentsModel} from "../ProposalCommentsModel";

export interface ValidityComment {
    validated?: boolean,
    comment?: ProposalCommentsModel
}

export interface Validation {
    id?: string,
    pfcId?: string,
    commentRef?: string,
    validationType?: string,
    validationDate?: string,
    validated?: boolean
}

export interface ValidationCommentDTO {
    newValidation: boolean,
    validation?: Validation,
    comment?: ProposalCommentsModel
}

export interface ProposalValidation {
    validation?: ValidityComment,
    proposal?: ProposalCommentsModel
}