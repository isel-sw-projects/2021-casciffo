export interface ProposalModel {
    id?: number,
    sigla: string,
    type: string,
    stateId?: number,
    serviceTypeId: number,
    therapeuticAreaId: number,
    pathologyId: number,
    principalInvestigatorId: number
}