import {StateModel} from "./StateModel";

export interface StateTransitionModel {
    id: string,
    previousStateId: string,
    newStateId: string,
    transitionDate: string,
    transitionType: string,
    referenceId: string,
    previousState?: StateModel,
    newState?: StateModel,
}