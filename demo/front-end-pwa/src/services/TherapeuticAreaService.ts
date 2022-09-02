import {PathologyModel} from "../model/proposal-constants/PathologyModel";
import ApiUrls from "../common/Links";
import {TherapeuticAreaModel} from "../model/proposal-constants/TherapeuticAreaModel";

export class TherapeuticAreaService {
    fetchAll() : Promise<Array<TherapeuticAreaModel>> {
        return fetch(ApiUrls.usersUrl)
            .then(rsp => rsp.json())
    }

    save(pathology: TherapeuticAreaModel): void {
        //TODO
    }
}