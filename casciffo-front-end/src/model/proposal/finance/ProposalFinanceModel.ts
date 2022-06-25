import {PromoterModel} from "./PromoterModel";
import {PartnershipModel} from "../../PartnershipModel";

export interface ProposalFinanceModel {
    id?: string,
    promoterId?: string,
    promoter?: PromoterModel,
    partnerships?: Array<PartnershipModel>,
    hasPartnerships: boolean,
    file?: unknown
}