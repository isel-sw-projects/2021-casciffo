import ApiUrls from "../common/Links";
import {httpGet, httpPost, httpPostNoBody, httpPut} from "../common/MyUtil";
import {
    DossierModel,
    PatientModel,
    PatientVisitsAggregate, ResearchAggregateModel, ResearchFinance, ResearchFinanceEntries,
    ResearchModel, ResearchModelAnswer, ResearchPatientModel, ResearchTeamFinanceEntries,
    ResearchVisitModel, ScientificActivityModel
} from "../model/research/ResearchModel";
import {StateModel} from "../model/state/StateModel";
import {StateChainTypes} from "../common/Constants";

export class ResearchAggregateService {

    getVisitDetails(researchId: string, visitId: string): Promise<ResearchVisitModel> {
        const url = ApiUrls.researchVisitDetailsUrl(researchId, visitId)
        return httpGet(url)
    }

    concludeVisit(researchId: string, visitId: string, visit: ResearchVisitModel): Promise<ResearchVisitModel> {
        const url = ApiUrls.researchVisitDetailsUrl(researchId, visitId)
        return httpPost(url, visit)
    }

    fetchByType(researchType: string): Promise<ResearchAggregateModel[]> {
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


    scheduleVisit(researchId: string, visit: ResearchVisitModel): Promise<ResearchVisitModel> {
        const url = ApiUrls.researchVisitsUrl(researchId)
        return httpPost(url, visit)
    }

    searchPatientsByProcessId(processId: string): Promise<PatientModel[]> {
        const url = ApiUrls.patientsLikeUrl(processId)
        return httpGet(url)
    }

    fetchResearchPatient(researchId: string, patientId: string): Promise<ResearchPatientModel> {
        const url = ApiUrls.researchPatientDetailUrl(researchId, patientId)
        return httpGet(url)
    }

    newScientificActivityEntry(researchId: string, activity: ScientificActivityModel): Promise<ScientificActivityModel> {
        const url = ApiUrls.researchStudiesUrl(researchId)
        return httpPost(url, activity)
    }

    saveRandomization(researchId: string, patients: PatientModel[]): Promise<ResearchPatientModel[]> {
        const url = ApiUrls.researchPatientsRandomize(researchId)
        return httpPut(url, patients)
    }

    completeResearch(researchId: string): Promise<ResearchModelAnswer> {
        const url = ApiUrls.researchCompleteUrl(researchId)
        return httpPostNoBody(url)
    }

    cancelResearch(researchId: string, reason: string, userId: string): Promise<ResearchModelAnswer> {
        const url = ApiUrls.researchCompleteUrl(researchId)
        return httpPost(url, {reason: reason, userId: userId})
    }

    updateResearchFinance(researchId: string, rf: ResearchFinance): Promise<ResearchFinance> {
        const url = ApiUrls.researchFinanceUrl(researchId)
        return httpPut(url, rf)
    }

    addPatientToResearch(researchId: string, patient: PatientModel): Promise<PatientModel> {
        const url = ApiUrls.researchPatientsUrl(researchId)
        return httpPost(url, patient)
    }

    addPatientAndVisitsToResearch(researchId: string, aggregate: PatientVisitsAggregate): Promise<PatientVisitsAggregate> {
        const url = ApiUrls.researchVisitsUrl(researchId)
        return httpPost(url, aggregate)
    }

    saveNewFinanceEntry(researchId: string, entry: ResearchFinanceEntries): Promise<ResearchFinanceEntries> {
        const url = ApiUrls.researchFinanceEntryUrl(researchId)
        return httpPut(url, entry)
    }

    saveNewTeamFinanceEntry(researchId: string, entry: ResearchTeamFinanceEntries): Promise<ResearchTeamFinanceEntries> {
        const url = ApiUrls.researchFinanceTeamEntryUrl(researchId)
        return httpPut(url, entry)
    }
}
