import UserModel from "./user/UserModel";

export interface TeamInvestigatorModel {
    id?: number,
    proposalId?: number,
    memberRole: string,
    memberId?: number,
    member?: UserModel
}