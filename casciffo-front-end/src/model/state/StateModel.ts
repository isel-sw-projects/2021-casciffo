
export interface StateModel {
    id?: string
    name: string
    nextInChain?: StateModel[]
    roles?: string[]
    stateFlowType?: string
}