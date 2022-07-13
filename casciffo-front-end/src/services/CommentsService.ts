import {ProposalCommentsModel} from "../model/proposal/ProposalCommentsModel";
import ApiUrls from "../common/Links";
import {httpGet, httpPost} from "../common/Util";

export default class CommentsService {

    fetchAllByProposalIdAndType(proposalId: number, commentType: string): Promise<ProposalCommentsModel[]> {
        const url = ApiUrls.commentsByTypeUrl(proposalId + "", commentType)
        return httpGet(url)
    }

    saveProposalComment(comment: ProposalCommentsModel): Promise<ProposalCommentsModel> {
        const url = ApiUrls.commentsUrl(""+comment.proposalId!!)
        return httpPost(url, comment)
    }
}