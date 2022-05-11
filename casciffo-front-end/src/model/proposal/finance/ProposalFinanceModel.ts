import {PromoterModel} from "./PromoterModel";
import {PartnershipModel} from "../../PartnershipModel";

export interface ProposalFinanceModel {
    id?: number,
    promoterId?: number,
    promoter: PromoterModel,
    partnerships?: Array<PartnershipModel>,
    file?: unknown
}