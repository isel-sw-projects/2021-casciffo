import ApiUrls from "../common/Links";
import {httpGet, httpPut} from "../common/Util";
import {ResearchModel} from "../model/research/ResearchModel";
import {StateModel} from "../model/state/StateModel";
import {ResearchTypes, StateChainTypes} from "../common/Constants";

export class ResearchAggregateService {
    fetchByType(researchType: string): Promise<ResearchModel[]> {
        const url = ApiUrls.researchByTypeUrl(researchType)
        return httpGet(url)
    }

    fetchResearch(researchId: string): Promise<ResearchModel> {
        const url = ApiUrls.researchDetailUrl(researchId)
        return httpGet(url)
    }

    fetchResearchStateChain(): Promise<StateModel[]> {
        const stateChainType = StateChainTypes.RESEARCH
        const url = ApiUrls.statesChainUrl(stateChainType)
        return httpGet(url)
    }

    updateResearch(data: ResearchModel): Promise<ResearchModel> {
        const url = ApiUrls.researchDetailUrl(data.id!)
        return httpPut(url, data)
    }
}