import UserModel from "../user/UserModel";

export interface ProposalCommentsModel {
    id?: string,
    proposalId?: string,
    commentType?: string,
    content: string,
    dateCreated?: number[],
    authorId?: number,
    author?: UserModel
}