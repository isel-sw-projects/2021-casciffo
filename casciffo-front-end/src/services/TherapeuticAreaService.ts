
import ApiUrls from "../common/Links";
import {TherapeuticAreaModel} from "../model/proposal-constants/TherapeuticAreaModel";
import {httpDelete, httpGet, httpPost} from "../common/MyUtil";

export class TherapeuticAreaService {
    fetchAll() : Promise<TherapeuticAreaModel[]> {
        const url = ApiUrls.therapeuticAreasUrl
        return httpGet(url)
    }

    save(therapeuticArea: TherapeuticAreaModel): Promise<TherapeuticAreaModel> {
        const url = ApiUrls.therapeuticAreasUrl
        return httpPost(url, therapeuticArea)
    }

    deleteTherapeuticArea(id: string): Promise<void> {
        const url = ApiUrls.therapeuticAreasDetailsUrl(id)
        return httpDelete(url)
    }
}