import {PatientModel, ResearchPatientModel} from "../model/research/ResearchModel";
import ApiUrls from "../common/Links";
import {httpDelete, httpGet, httpPost} from "../common/MyUtil";

export class PatientService {
    searchPatientsByProcessId(processId: string): Promise<PatientModel[]> {
        const url = ApiUrls.patientsLikeUrl(processId)
        return httpGet(url)
    }

    fetchResearchPatient(researchId: string, patientId: string): Promise<ResearchPatientModel> {
        const url = ApiUrls.researchPatientDetailUrl(researchId, patientId)
        return httpGet(url)
    }

    fetchPatients(): Promise<PatientModel[]> {
        const url = ApiUrls.patientsUrl
        return httpGet(url)
    }

    savePatient(newEntry: PatientModel): Promise<PatientModel> {
        const url = ApiUrls.patientsUrl
        return httpPost(url, newEntry)
    }

    deletePatient(patientId: string): Promise<PatientModel | undefined | null> {
        const url = ApiUrls.patientDetailsUrl(patientId)
        return httpDelete(url)
    }
}