import {ProposalModel} from "../model/proposal/ProposalModel";
import ApiUrls from "../common/Links";
import {ResearchType} from "../common/Types";

class ProposalService {
    fetchByType(type: ResearchType): Promise<Array<ProposalModel>> {
        return fetch(`${ApiUrls.proposalsUrl}/?type=${type.id}`).then(rsp => rsp.json())
    }

    fetchById(id: number) : Promise<ProposalModel> {
        return fetch(ApiUrls.buildDetailProposalUrl(`${id}`)).then(rsp => rsp.json())
    }
}

export default ProposalService