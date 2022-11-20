
import ApiUrls from "../common/Links";
import {TherapeuticAreaModel} from "../model/proposal-constants/TherapeuticAreaModel";
import {httpPost} from "../common/MyUtil";
import {PathologyModel} from "../model/proposal-constants/PathologyModel";

// noinspection JSUnusedGlobalSymbols
export class TherapeuticAreaService {
    fetchAll() : Promise<Array<TherapeuticAreaModel>> {
        return fetch(ApiUrls.usersUrl)
            .then(rsp => rsp.json())
    }

    save(pathology: TherapeuticAreaModel): Promise<PathologyModel> {
        const url = ApiUrls.pathologiesUrl
        return httpPost(url, pathology)
    }
}