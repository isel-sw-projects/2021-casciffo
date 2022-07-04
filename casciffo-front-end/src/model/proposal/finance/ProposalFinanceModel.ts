import {PromoterModel} from "./PromoterModel";
import {PartnershipModel} from "../../PartnershipModel";
import {ProtocolModel} from "./ProtocolModel";

export interface ProposalFinanceModel {
    id?: string,
    promoterId?: string,
    promoter?: PromoterModel,
    partnerships?: Array<PartnershipModel>,
    hasPartnerships: boolean,
    protocol?: ProtocolModel,
    file?: unknown
}