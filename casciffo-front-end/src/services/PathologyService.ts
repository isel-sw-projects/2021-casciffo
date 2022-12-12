import {PathologyModel} from "../model/proposal-constants/PathologyModel";
import ApiUrls from "../common/Links";
import {httpDelete, httpGet, httpPost} from "../common/MyUtil";

export class PathologyService {
    fetchAll() : Promise<Array<PathologyModel>> {
        const url = ApiUrls.pathologiesUrl
        return httpGet(url)
    }

    save(pathology: PathologyModel): Promise<PathologyModel> {
        const url = ApiUrls.pathologiesUrl
        return httpPost(url, pathology)
    }

    deletePathology(id: string): Promise<void> {
        const url= ApiUrls.pathologiesDetailsUrl(id)
        return httpDelete(url)
    }
}
