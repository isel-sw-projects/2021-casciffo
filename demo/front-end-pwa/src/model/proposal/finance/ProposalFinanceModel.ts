import {PromoterModel} from "./PromoterModel";
import {PartnershipModel} from "../../PartnershipModel";
import {ProtocolModel} from "./ProtocolModel";

interface ValidationModel {
    id?: string,
    pfcId?: string,
    validationType?: string,
    validated?: boolean,
    validatedDate?: string,
    commentRef?: string
}

export interface ProposalFinanceModel {
    id?: string,
    promoterId?: string,
    promoter?: PromoterModel,
    partnerships?: Array<PartnershipModel>,
    hasPartnerships: boolean,
    protocol?: ProtocolModel,
    validations?: ValidationModel[],
    file?: unknown
}