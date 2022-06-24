import ProposalService from "./ProposalService";
import {Constants} from "../common/Types";
import ApiUrls from "../common/Links";
import {ProposalModel} from "../model/proposal/ProposalModel";
import {UserService} from "./UserService";
import UserModel from "../model/user/UserModel";
import {ProposalCommentsModel} from "../model/proposal/ProposalCommentsModel";
import CommentsService from "./CommentsService";
import {TimelineEventModel} from "../model/TimelineEventModel";
import {ProtocolCommentsModel} from "../model/proposal/finance/ProtocolCommentsModel";
import {ProtocolModel} from "../model/proposal/finance/ProtocolModel";

export default class ProposalAggregateService {
    private proposalService = new ProposalService()
    private userService = new UserService()
    private commentsService = new CommentsService()

    fetchInvestigators(name: string) : Promise<UserModel[]> {
        return fetch(ApiUrls.usersByRoleAndNameUrl(name,["UIC", "SUPERUSER"])).then(rsp => rsp.json())
    }

    fetchConstants(): Promise<Constants> {
        return fetch(ApiUrls.constantsUrl).then(rsp => rsp.json())
    }

    saveProposal(proposal: ProposalModel): Promise<ProposalModel> {
        return this.proposalService.save(proposal)
    }

    fetchProposalComments(proposalId: number, commentType: string) : Promise<ProposalCommentsModel[]> {
        return this.commentsService.fetchAllByProposalIdAndType(proposalId, commentType)
    }

    saveProposalComment(comment: ProposalCommentsModel): Promise<ProposalCommentsModel> {
        return this.commentsService.saveProposalComment(comment)
    }

    fetchConstantsMock(): Promise<Constants> {
        return new Promise<Constants>(resolve => {
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

    advanceState(proposalId: string, forward: boolean): Promise<ProposalModel> {
        return this.proposalService.advanceState(proposalId, forward)
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

    saveProtocolComment(proposalId: string, pfcId: string, comment: ProtocolCommentsModel) {
        return this.proposalService.saveProtocolComment(proposalId, pfcId, comment)
    }

    updateProtocol(proposalId: string, protocol: ProtocolModel) {
        return this.proposalService.updateProtocol(proposalId, protocol)
    }

    updateTimelineEvent(proposalId: string, eventId: string, completed: boolean) {
        return this.proposalService.updateTimelineEvent(proposalId, eventId, completed)
    }
}