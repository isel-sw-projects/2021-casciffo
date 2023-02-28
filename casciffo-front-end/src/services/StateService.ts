import {StateModel} from "../model/state/StateModel";
import ApiUrls from "../common/Links";
import {httpGet} from "../common/MyUtil";

export class StateService {
    fetchAll() : Promise<StateModel> {
        return fetch(ApiUrls.statesUrl).then(rsp => rsp.json())
    }

    fetchByType(type: string): Promise<StateModel[]> {
        const url = ApiUrls.statesChainUrl(type)
        return httpGet(url);
    }
}