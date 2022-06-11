import {ProtocolCommentsModel} from "./ProtocolCommentsModel";

export interface ProtocolModel {
    id?: string,
    validatedDate: number[],
    isValidated: boolean,
    financialComponentId?: number,
    comments?: ProtocolCommentsModel[]
}