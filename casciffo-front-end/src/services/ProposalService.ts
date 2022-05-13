import {ProposalModel} from "../model/proposal/ProposalModel";
import ApiUrls from "../common/Links";
import {ResearchType} from "../common/Types";
import {ResearchTypes} from "../model/ResearchTypes";
import {PromoterTypes} from "../model/PromoterTypes";

class ProposalService {

    fetchByType(type: string, sort: string): Promise<Array<ProposalModel>> {
        return fetch(ApiUrls.proposalsByTypeUrl(type)).then(rsp => rsp.json())
    }

    fetchByTypeMock(type: string): Promise<Array<ProposalModel>> {
        console.log("reached here")
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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proposal)
        }
        return fetch(ApiUrls.proposalsUrl, opt)
    }
}

export default ProposalService