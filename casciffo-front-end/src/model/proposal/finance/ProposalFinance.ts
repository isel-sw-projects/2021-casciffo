import {PromoterModel} from "./PromoterModel";
import {Partnership} from "../../../common/Types";

export interface ProposalFinance {
    id?: number,
    promoterId?: number,
    promoter: PromoterModel,
    partnerships?: Array<Partnership>
}