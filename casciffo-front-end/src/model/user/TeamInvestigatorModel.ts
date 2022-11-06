import UserModel from "./UserModel";

export interface TeamInvestigatorModel {
    id?: number,
    proposalId?: number,
    memberRole: string,
    memberId?: number,
    member?: UserModel
}