import {PathologyModel} from "../model/constants/PathologyModel";
import ApiUrls from "../common/Links";

class PathologyService {
    fetchAll() : Promise<Array<PathologyModel>> {
        return fetch(ApiUrls.pathologiesUrl)
            .then(rsp => rsp.json())
    }

    save(pathology: PathologyModel): void {
        //TODO
    }
}

export default PathologyService