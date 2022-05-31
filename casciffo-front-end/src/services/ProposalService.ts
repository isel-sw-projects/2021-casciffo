import {ProposalModel} from "../model/proposal/ProposalModel";
import ApiUrls from "../common/Links";
import {PromoterTypes, ResearchTypes} from "../common/Constants";
import {TimelineEventModel} from "../model/TimelineEventModel";
import {ProtocolModel} from "../model/proposal/finance/ProtocolModel";
import {ProtocolCommentsModel} from "../model/proposal/finance/ProtocolCommentsModel";

class ProposalService {

    fetchByType(type: string, sort: string = "dateCreated"): Promise<Array<ProposalModel>> {
        return fetch(ApiUrls.proposalsByTypeUrl(type)).then(rsp => rsp.json())
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
            dateCreated: [],
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
            dateCreated: [],
        }
        return new Promise(resolve => { setTimeout(() =>
            resolve(
                type === ResearchTypes.OBSVERTIONAL_STUDY.id ? [proposal2,{...proposal1, id: 4}] : [proposal1, {...proposal1, id: 3}]
            ), 1)
        })
    }

    fetchById(id: string | undefined) : Promise<ProposalModel> {
        return fetch(ApiUrls.buildDetailProposalUrl(`${id}`)).then(rsp => rsp.json())
    }

    save(proposal: ProposalModel) {
        const opt : RequestInit = {
            method: 'POST',
            headers: [['Content-Type', 'application/json']],
            body: JSON.stringify(proposal)
        }
        return fetch(ApiUrls.proposalsUrl, opt)
    }

    advanceState(proposalId: string, forward :boolean): Promise<ProposalModel> {
        const opt : RequestInit = {
            method: 'PUT',
        }
        return fetch(ApiUrls.proposalsTransitionUrl(proposalId, forward), opt).then(rsp => rsp.json())
    }

    saveTimelineEvent(proposalId: string, event: TimelineEventModel): Promise<TimelineEventModel> {
        const url = ApiUrls.proposalsTimelineEventUrl(proposalId)
        const opt : RequestInit = {
            headers: [['Content-type', 'application/json']],
            method: 'POST',
            body: JSON.stringify(event)
        }
        return fetch(url, opt).then(rsp => rsp.json())
    }

    fetchTimelineEvents(proposalId: string): Promise<TimelineEventModel[]> {
        const url = ApiUrls.proposalsTimelineEventUrl(proposalId)
        const opt : RequestInit = {
            method: 'GET'
        }
        return fetch(url, opt).then(rsp => rsp.json())
    }

    fetchProtocol(proposalId: string, pfcId: string): Promise<ProtocolModel> {
        const url = ApiUrls.proposalsProtocol(proposalId, pfcId)
        const opt : RequestInit = {
            method: 'GET'
        }
        return fetch(url, opt).then(rsp => rsp.json())
    }

    updateProtocol(proposalId: string, protocol: ProtocolModel): Promise<ProtocolModel> {
        const url = ApiUrls.proposalsProtocol(proposalId, protocol.financialComponentId!+"")
        const opt : RequestInit = {
            method: 'PUT',
            headers: [['Content-Type', 'application/json']],
            body: JSON.stringify(protocol)
        }
        return fetch(url, opt).then(rsp => rsp.json())
    }

    saveProtocolComment
    (
        proposalId: string,
        pfcId: string,
        comment: ProtocolCommentsModel
    ): Promise<ProtocolCommentsModel> {
        const url = ApiUrls.proposalsProtocolComments(proposalId, pfcId)
        const opt : RequestInit = {
            method: 'POST',
            headers: [['Content-Type', 'application/json']],
            body: JSON.stringify(comment)
        }
        return fetch(url, opt).then(rsp => rsp.json())
    }

    updateTimelineEvent(proposalId: string, eventId: string, completed: boolean): Promise<TimelineEventModel> {
        const url = ApiUrls.proposalsTimelineEventUpdateUrl(proposalId, eventId, completed)
        const opt : RequestInit = {
            method: 'PUT',
            headers: [['Content-Type', 'application/json']],
        }
        return fetch(url, opt).then(rsp => rsp.json())
    }
}

export default ProposalService