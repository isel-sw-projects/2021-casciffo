import {ProtocolCommentsModel} from "./ProtocolCommentsModel";

export interface ProtocolModel {
    id?: string,
    validatedDate: string,
    isValidated: boolean,
    financialComponentId?: number,
    comments?: ProtocolCommentsModel[]
}