import ApiUrls from "../common/Links";
import {httpGet, httpPost, httpPut} from "../common/Util";
import {
    DossierModel,
    PatientModel,
    PatientVisitsAggregate,
    ResearchModel,
    ResearchVisitModel
} from "../model/research/ResearchModel";
import {StateModel} from "../model/state/StateModel";
import {ResearchTypes, StateChainTypes} from "../common/Constants";

export class ResearchAggregateService {
    fetchByType(researchType: string): Promise<ResearchModel[]> {
        const url = ApiUrls.researchByTypeUrl(researchType)
        return httpGet(url)
    }

    fetchResearch(researchId: string): Promise<ResearchModel> {
        const url = ApiUrls.researchDetailUrl(researchId)
        return httpGet(url)
    }

    fetchResearchStateChain(): Promise<StateModel[]> {
        const stateChainType = StateChainTypes.RESEARCH
        const url = ApiUrls.statesChainUrl(stateChainType)
        return httpGet(url)
    }

    updateResearch(data: ResearchModel): Promise<ResearchModel> {
        const url = ApiUrls.researchDetailUrl(data.id!)
        return httpPut(url, data)
    }

    addDossierToResearch(researchId: string, dossier: DossierModel): Promise<DossierModel> {
        const url = ApiUrls.researchDossierUrl(researchId)
        return httpPost(url, dossier)
    }

    addStudiesToResearch(researchId: string, dossier: DossierModel): Promise<DossierModel> {
        const url = ApiUrls.researchStudiesUrl(researchId)
        return httpPost(url, dossier)
    }

    scheduleVisit(researchId: string, visit: ResearchVisitModel): Promise<ResearchVisitModel> {
        const url = ApiUrls.researchVisitsUrl(researchId)
        return httpPost(url, visit)
    }

    addPatientToResearch(researchId: string, patient: PatientModel): Promise<PatientModel> {
        const url = ApiUrls.researchPatientsUrl(researchId)
        return httpPost(url, patient)
    }

    addPatientAndVisitsToResearch(researchId: string, aggregate: PatientVisitsAggregate): Promise<PatientVisitsAggregate> {
        const url = ApiUrls.researchPatientsVisitsUrl(researchId)
        return httpPost(url, aggregate)
    }
}