import {ProposalCommentsModel} from "../model/proposal/ProposalCommentsModel";
import ApiUrls from "../common/Links";

export default class CommentsService {

    fetchAllByProposalIdAndType(proposalId: number, commentType: string): Promise<ProposalCommentsModel[]> {
        const url = ApiUrls.commentsByTypeUrl(proposalId + "", commentType)
        return fetch(url).then(rsp => rsp.json());
    }

    saveProposalComment(comment: ProposalCommentsModel): Promise<ProposalCommentsModel> {
        const url = ApiUrls.commentsUrl(""+comment.proposalId!!)
        const headers = new Headers()
        headers.set("Content-type", "application/json")
        const requestParams: RequestInit = {
            headers: headers,
            method: "POST",
            body: JSON.stringify(comment),
        }
        return fetch(url, requestParams).then(rsp => rsp.json())
    }
}