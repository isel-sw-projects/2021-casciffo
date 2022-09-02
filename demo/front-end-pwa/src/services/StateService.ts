import {StateModel} from "../model/state/StateModel";
import ApiUrls from "../common/Links";

export class StateService {
    fetchAll() : Promise<StateModel> {
        return fetch(ApiUrls.statesUrl).then(rsp => rsp.json())
    }
}