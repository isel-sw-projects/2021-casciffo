import {ProposalModel} from "../model/proposal/ProposalModel";
import ApiUrls from "../common/Links";
import {PromoterTypes, ResearchTypes} from "../common/Constants";
import {TimelineEventModel} from "../model/TimelineEventModel";
import {ProtocolModel} from "../model/proposal/finance/ProtocolModel";
import {ProtocolCommentsModel} from "../model/proposal/finance/ProtocolCommentsModel";
import {httpGet, httpPost, httpPut} from "../common/Util";

class ProposalService {

    fetchByType(type: string, sort: string = "dateCreated"): Promise<Array<ProposalModel>> {
        const url = ApiUrls.proposalsByTypeUrl(type)
        return httpGet(url)
    }

    fetchByTypeMock(type: string): Promise<Array<ProposalModel>> {
        const proposal1: ProposalModel = {
            id: 1,
            sigla: "Javelin",
            stateId: 0,
            pathologyId: 0,
            principalInvestigatorId: 0,
            principalInvestigator: {name:"Dr. Nuno", email:"outro email bue fixe"},
            serviceTypeId: 0,
            therapeuticAreaId: 0,
            type: ResearchTypes.CLINICAL_TRIAL.id,
            state: {name: "Submetido"},
            pathology: {name: "Refluxo gastroesofágico"},
            serviceType: {name: "Gastrenterologia"},
            therapeuticArea: {name: "Gastrenterologia"},
            dateCreated: "",
            financialComponent: {
                promoter: {id: "1", name:"Merck KGaA", email:"abc@promotor1.com", promoterType: PromoterTypes.COMMERCIAL.id},
                partnerships: [{name:"abc", description: "abc", phoneContact: "abc", siteUrl: "abc", representative: "abc", email: "abc"}]
            }
        }
        const proposal2: ProposalModel = {
            id: 2,
            stateId: 0,
            pathologyId: 0,
            principalInvestigatorId: 0,
            principalInvestigator: {name:"Dr. Hermilindo", email:"1email bue fixe"},
            serviceTypeId: 0,
            sigla: "Firefly",
            therapeuticAreaId: 0,
            type: ResearchTypes.OBSVERTIONAL_STUDY.id,
            state: {name: "Validação Interna"},
            pathology: {name: "patologia2"},
            serviceType: {name: "serviço2"},
            therapeuticArea: {name: "area terapeutica 2"},
            dateCreated: "",
        }
        return new Promise(resolve => { setTimeout(() =>
            resolve(
                type === ResearchTypes.OBSVERTIONAL_STUDY.id ? [proposal2,{...proposal1, id: 4}] : [proposal1, {...proposal1, id: 3}]
            ), 1)
        })
    }

    fetchById(id: string | undefined) : Promise<ProposalModel> {
        const url = ApiUrls.buildDetailProposalUrl(`${id}`)
        return httpGet(url)
    }

    save(proposal: ProposalModel): Promise<ProposalModel> {
        const url = ApiUrls.proposalsUrl
        return httpPost(url, proposal)
    }

    advanceState(proposalId: string, forward :boolean): Promise<ProposalModel> {
        const url = ApiUrls.proposalsTransitionUrl(proposalId, forward)
        return httpPut(url)
    }

    saveTimelineEvent(proposalId: string, event: TimelineEventModel): Promise<TimelineEventModel> {
        const url = ApiUrls.proposalsTimelineEventUrl(proposalId)
        return httpPost(url, event)
    }

    fetchTimelineEvents(proposalId: string): Promise<TimelineEventModel[]> {
        const url = ApiUrls.proposalsTimelineEventUrl(proposalId)
        return httpGet(url)
    }

    fetchProtocol(proposalId: string, pfcId: string): Promise<ProtocolModel> {
        const url = ApiUrls.proposalsProtocol(proposalId, pfcId)
        return httpGet(url)
    }

    updateProtocol(proposalId: string, protocol: ProtocolModel): Promise<ProtocolModel> {
        const url = ApiUrls.proposalsProtocol(proposalId, protocol.financialComponentId!+"")
        return httpPut(url, protocol)
    }

    saveProtocolComment
    (
        proposalId: string,
        pfcId: string,
        comment: ProtocolCommentsModel
    ): Promise<ProtocolCommentsModel> {
        const url = ApiUrls.proposalsProtocolComments(proposalId, pfcId)
        return httpPost(url, comment)
    }

    updateTimelineEvent(proposalId: string, eventId: string, completed: boolean): Promise<TimelineEventModel> {
        const url = ApiUrls.proposalsTimelineEventUpdateUrl(proposalId, eventId, completed)
        return httpPut(url)
    }
}

export default ProposalService