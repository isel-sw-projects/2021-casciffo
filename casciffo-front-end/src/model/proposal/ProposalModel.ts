import {StateModel} from "../state/StateModel";
import {ServiceTypeModel} from "../constants/ServiceTypeModel";
import {TherapeuticAreaModel} from "../constants/TherapeuticAreaModel";
import {PathologyModel} from "../constants/PathologyModel";
import UserModel from "../user/UserModel";
import {ProposalFinanceModel} from "./finance/ProposalFinanceModel";
import {Investigator} from "../../common/Types";
import {TeamInvestigatorModel} from "../TeamInvestigatorModel";
import {StateTransitionModel} from "../state/StateTransitionModel";

export interface ProposalModel {
    id?: number,
    sigla: string,
    type: string,
    stateId?: number,
    pathologyId: number,
    serviceTypeId: number,
    therapeuticAreaId: number,
    principalInvestigatorId: number,
    state?: StateModel,
    serviceType?: ServiceTypeModel,
    therapeuticArea?: TherapeuticAreaModel,
    pathology?: PathologyModel,
    principalInvestigator?: UserModel,
    //date comes formatted as [year, month, day, hour, min, sec, milis]
    dateCreated?: Array<number>,
    dateModified?: Array<number>,
    financialComponent?: ProposalFinanceModel,
    investigationTeam?: Array<TeamInvestigatorModel>,
    stateTransitions?: Array<StateTransitionModel>
}