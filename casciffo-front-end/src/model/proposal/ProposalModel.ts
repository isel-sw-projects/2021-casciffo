import {StateModel} from "../state/StateModel";
import {ServiceTypeModel} from "../proposal-constants/ServiceTypeModel";
import {TherapeuticAreaModel} from "../proposal-constants/TherapeuticAreaModel";
import {PathologyModel} from "../proposal-constants/PathologyModel";
import UserModel from "../user/UserModel";
import {ProposalFinanceModel} from "./finance/ProposalFinanceModel";
import {Investigator} from "../../common/Types";
import {TeamInvestigatorModel} from "../TeamInvestigatorModel";
import {StateTransitionModel} from "../state/StateTransitionModel";
import {ProposalCommentsModel} from "./ProposalCommentsModel";
import {TimelineEventModel} from "../TimelineEventModel";

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
    //date comes formatted as yyyy-MM-dd'T'HH:mm:ss.SSSSSS
    createdDate?: string,
    lastModified?: string,
    financialComponent?: ProposalFinanceModel,
    investigationTeam?: Array<TeamInvestigatorModel>,
    stateTransitions?: Array<StateTransitionModel>,
    comments?: Array<ProposalCommentsModel>,
    timelineEvents?: Array<TimelineEventModel>
}