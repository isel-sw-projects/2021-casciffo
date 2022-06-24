import {StateModel} from "./StateModel";

export interface StateTransitionModel {
    id: number,
    previousStateId: number,
    newStateId: number,
    transitionDate: string,
    transitionType: string,
    referenceId: number,
    previousState?: StateModel,
    newState?: StateModel,
}