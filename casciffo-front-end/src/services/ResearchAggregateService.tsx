import ApiUrls from "../common/Links";
import {axiosPostFormFile, httpDelete, httpGet, httpGetFile, httpPost, httpPostNoBody, httpPut} from "../common/MyUtil";
import {
    AddendaCommentsModel,
    DossierModel,
    PatientModel,
    PatientVisitsAggregate,
    ResearchAddenda,
    ResearchAggregateModel,
    ResearchFinance,
    ResearchFinanceEntry,
    ResearchFinanceNewEntryDTO,
    ResearchModel,
    ResearchModelAnswer,
    ResearchPatientModel,
    ResearchPatientVisitsAggregate,
    ResearchTeamFinanceEntry,
    ResearchVisitModel,
    ScientificActivityModel
} from "../model/research/ResearchModel";
import {StateModel} from "../model/state/StateModel";
import {StateChainTypes} from "../common/Constants";
import {AxiosResponseBody, CountHolder} from "../common/Types";
import {PatientService} from "./PatientService";
import {StateService} from "./StateService";

export class ResearchAggregateService {
    private patientService = new PatientService()
    private stateService = new StateService()

    getResearchCount(): Promise<CountHolder> {
        const url = ApiUrls.researchCountUrl
        return httpGet(url)
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
        return this.stateService.fetchByType(stateChainType)
    }

    updateResearch(data: ResearchModel): Promise<ResearchModel> {
        const url = ApiUrls.researchDetailUrl(data.id!)
        return httpPut(url, data)
    }

    addDossierToResearch(researchId: string, dossier: DossierModel): Promise<DossierModel> {
        const url = ApiUrls.researchDossierUrl(researchId)
        return httpPost(url, dossier)
    }

    getVisitDetails(researchId: string, visitId: string): Promise<ResearchVisitModel> {
        const url = ApiUrls.researchVisitDetailsUrl(researchId, visitId)
        return httpGet(url)
    }

    concludeVisit(researchId: string, visitId: string, visit: ResearchVisitModel): Promise<ResearchVisitModel> {
        const url = ApiUrls.researchVisitDetailsUrl(researchId, visitId)
        return httpPost(url, visit)
    }

    addPatientAndScheduleVisits(researchId: string, patientVisitsAggregate: PatientVisitsAggregate): Promise<ResearchPatientVisitsAggregate> {
        const url = ApiUrls.patientWithVisitsUrl(researchId)
        return httpPost(url, patientVisitsAggregate)
    }

    scheduleVisit(researchId: string, visit: ResearchVisitModel): Promise<ResearchVisitModel[]> {
        const url = ApiUrls.researchVisitsUrl(researchId)
        return httpPost(url, visit)
    }

    searchPatientsByProcessId(processId: string): Promise<PatientModel[]> {
        return this.patientService.searchPatientsByProcessId(processId)
    }

    fetchResearchPatient(researchId: string, patientId: string): Promise<ResearchPatientModel> {
        return this.patientService.fetchResearchPatient(researchId, patientId)
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
        const url = ApiUrls.researchCancelUrl(researchId)
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

    saveNewFinanceEntry(researchId: string, entry: ResearchFinanceEntry): Promise<ResearchFinanceNewEntryDTO> {
        const url = ApiUrls.researchFinanceEntryUrl(researchId)
        return httpPut(url, entry)
    }

    saveNewTeamFinanceEntry(researchId: string, entry: ResearchTeamFinanceEntry): Promise<ResearchFinanceNewEntryDTO> {
        const url = ApiUrls.researchFinanceTeamEntryUrl(researchId)
        return httpPut(url, entry)
    }

    removeParticipant(researchId: string, patientId: string): Promise<void> {
        const url = ApiUrls.researchPatientDetailUrl(researchId, patientId)
        return httpDelete(url)
    }

    fetchAddendaDetails(researchId: string, addendaId: string): Promise<ResearchAddenda> {
        const url = ApiUrls.researchAddendaDetailUrl(researchId, addendaId)
        return httpGet(url)
    }

    fetchAddendaStateChain(): Promise<StateModel[]> {
        const url = ApiUrls.statesChainUrl(StateChainTypes.ADDENDA)
        return httpGet(url)
    }

    updateAddenda(addenda: ResearchAddenda): Promise<ResearchAddenda> {
        const url = ApiUrls.researchAddendaDetailUrl(addenda.researchId!, addenda.id!)
        return httpGet(url)
    }

    updateAddendaState(researchId: string, addendaId: string, nextStateId: string): Promise<ResearchAddenda> {
        const url = ApiUrls.researchAddendaDetailStateUrl(researchId, addendaId, nextStateId)
        return httpPut(url)
    }

    uploadAddendaFile(researchId: string, file: File): Promise<AxiosResponseBody> {
        const url = ApiUrls.researchAddendaDetailFileUploadUrl(researchId)
        return axiosPostFormFile(url, file)
    }

    downloadAddendaFile(researchId: string, addendaId: string): Promise<void> {
        const url = ApiUrls.researchAddendaDetailFileDownloadUrl(researchId, addendaId)
        return httpGetFile(url)
    }

    createAddendaObservation(researchId: string, addendaId: string, observation: AddendaCommentsModel): Promise<AddendaCommentsModel> {
        const url = ApiUrls.researchAddendaDetailCommentsUrl(researchId, addendaId)
        return httpPost(url, observation)
    }

    cancelAddenda(researchId: string, addendaId: string): Promise<ResearchAddenda> {
        const url = ApiUrls.researchAddendaCancelUrl(researchId, addendaId)
        return httpPut(url)
    }

    removeDossier(researchId: string, dId: string): Promise<void> {
        const url = ApiUrls.researchDossierDetailUrl(researchId, dId)
        return httpDelete(url)
    }
}
