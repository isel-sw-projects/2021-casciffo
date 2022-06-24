import UserModel from "../user/UserModel";

export interface ProposalCommentsModel {
    id?: string,
    proposalId?: string,
    commentType?: string,
    content: string,
    dateCreated?: string,
    authorId?: number,
    author?: UserModel
}