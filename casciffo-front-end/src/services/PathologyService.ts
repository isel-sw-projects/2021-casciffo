import {PathologyModel} from "../model/proposal-constants/PathologyModel";
import ApiUrls from "../common/Links";
import {httpGet, httpPost} from "../common/MyUtil";

// noinspection JSUnusedGlobalSymbols
export class PathologyService {
    fetchAll() : Promise<Array<PathologyModel>> {
        const url = ApiUrls.pathologiesUrl
        return httpGet(url)
    }

    save(pathology: PathologyModel): Promise<PathologyModel> {
        const url = ApiUrls.pathologiesUrl
        return httpPost(url, pathology)
    }
}
