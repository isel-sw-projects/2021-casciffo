import {StateModel} from "./StateModel";

export interface StateTransitionModel {
    id: number,
    stateBeforeId: number,
    newStateId: number,
    transitionDate: Array<number>,
    transitionType: string,
    referenceId: number,
    stateBefore?: StateModel,
    stateAfter?: StateModel,
}