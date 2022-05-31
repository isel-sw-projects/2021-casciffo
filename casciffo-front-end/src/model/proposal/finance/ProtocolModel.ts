import {ProtocolCommentsModel} from "./ProtocolCommentsModel";

export interface ProtocolModel {
    id?: string,
    internalName?: string,// = "Comissão de Ética para Investigação Clínica",
    externalName?: string,// = "INFARMED, I.P",
    internalDateValidated?: number[],
    externalDateValidated?: number[],
    externalValidated?: boolean,
    internalValidated?: boolean,
    financialComponentId?: number,
    comments?: ProtocolCommentsModel[]
}