import ApiUrls from "../common/Links";
import {httpGet} from "../common/Util";
import {ResearchModel} from "../model/research/ResearchModel";

export class ResearchAggregateService {
    fetchByType(researchType: string): Promise<ResearchModel[]> {
        const url = ApiUrls.researchByTypeUrl(researchType)
        return httpGet(url)
    }


}