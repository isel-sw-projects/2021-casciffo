import ProposalService from "./ProposalService";
import {ConstantsModel} from "../common/Types";
import {ProposalModel} from "../model/proposal/ProposalModel";
import UserModel from "../model/user/UserModel";
import {ProposalCommentsModel} from "../model/proposal/ProposalCommentsModel";
import CommentsService from "./CommentsService";
import {TimelineEventModel} from "../model/proposal/TimelineEventModel";
import {ValidationCommentDTO, ValidityComment} from "../model/proposal/finance/ValidationModels";
import {StateModel} from "../model/state/StateModel";
import {UserService} from "./UserService";
import {ProtocolAggregateDTO} from "../model/proposal/finance/ProtocolModel";
import {ConstantsService} from "./ConstantsService";
import {StateService} from "./StateService";

export default class ProposalAggregateService {
    private proposalService = new ProposalService()
    private commentsService = new CommentsService()
    private userService = new UserService()


    private constantsService = new ConstantsService()

    fetchInvestigators(name: string) : Promise<UserModel[]> {
        return this.userService.fetchUsersLike(name, ["UIC", "SUPERUSER"])
    }

    fetchConstants(): Promise<ConstantsModel> {
        return this.constantsService.fetchConstants()
    }

    saveProposal(proposal: ProposalModel): Promise<ProposalModel> {
        return this.proposalService.save(proposal)
    }

    fetchProposalStates(proposalType: string): Promise<StateModel[]> {
        return this.proposalService.fetchStates(proposalType)
    }

    fetchProposalComments(proposalId: number, commentType: string) : Promise<ProposalCommentsModel[]> {
        return this.commentsService.fetchAllByProposalIdAndType(proposalId, commentType)
    }

    saveProposalComment(comment: ProposalCommentsModel): Promise<ProposalCommentsModel> {
        return this.commentsService.saveProposalComment(comment)
    }

    fetchConstantsMock(): Promise<ConstantsModel> {
        return new Promise<ConstantsModel>(resolve => {
            setTimeout(() =>
                resolve({
                    serviceTypes: [{id: 1, name: "service1"}],
                    pathologies: [{id: 1, name: "service1"}],
                    therapeuticAreas: [{id: 1, name: "Terapia Cardio"}]
                }), 1)
        })
    }

    fetchProposalById(proposalId: string): Promise<ProposalModel> {
        return this.proposalService.fetchById(proposalId)
    }

    advanceState(proposalId: string, nextStateId: string): Promise<ProposalModel> {
        return this.proposalService.advanceState(proposalId, nextStateId)
    }

    saveTimelineEvent(proposalId: string, event: TimelineEventModel) {
        return this.proposalService.saveTimelineEvent(proposalId, event)
    }

    fetchProposalTimelineEvents(proposalId: string) {
        return this.proposalService.fetchTimelineEvents(proposalId)
    }

    fetchProtocol(proposalId: string, pfcId: string) {
        return this.proposalService.fetchProtocol(proposalId, pfcId)
    }

    saveProtocolComment(proposalId: string, pfcId: string, comment: ValidityComment): Promise<ProtocolAggregateDTO> {
        return this.proposalService.saveProtocolComment(proposalId, pfcId, comment)
    }

    updateTimelineEvent(proposalId: string, eventId: string, completed: boolean) {
        return this.proposalService.updateTimelineEvent(proposalId, eventId, completed)
    }

    validate(proposalId: string, pfcId: string, validationType: string, validationComment: ValidationCommentDTO) {
        return this.proposalService.validate(proposalId, pfcId, validationType, validationComment)
    }

    saveFinancialContract(pId: string,pfcId: string, file: File) {
        return this.proposalService.uploadFinancialContract(pId, pfcId, file)
    }

    downloadFinancialContract(pId: string,pfcId: string) {
        return this.proposalService.downloadFinancialContract(pId, pfcId)
    }
}