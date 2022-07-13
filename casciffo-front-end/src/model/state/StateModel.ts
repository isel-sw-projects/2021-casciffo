
export interface StateModel {
    id?: number
    name: string
    nextInChain?: StateModel[]
    roles?: string[]
    stateFlowType?: string
}