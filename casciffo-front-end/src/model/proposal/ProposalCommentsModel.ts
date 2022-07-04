import UserModel from "../user/UserModel";

export interface ProposalCommentsModel {
    id?: string,
    proposalId?: string,
    commentType?: string,
    content: string,
    createdDate?: string,
    authorId?: string,
    author?: UserModel
}