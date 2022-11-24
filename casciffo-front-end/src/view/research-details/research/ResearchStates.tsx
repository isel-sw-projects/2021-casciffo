
import React, {useEffect, useState} from "react";
import {Container, Form, Stack} from "react-bootstrap";
import {StateModel} from "../../../model/state/StateModel";
import {MyError} from "../../error-view/MyError";
import {STATES} from "../../../model/state/STATES";
import {StateFlowTypes} from "../../../common/Constants";
import {StateTransitionModel} from "../../../model/state/StateTransitionModel";
import {MyUtil} from "../../../common/MyUtil";
import UserModel from "../../../model/user/UserModel";


type ResearchStatesProps = {
    states: StateModel[],
    stateTransitions: StateTransitionModel[],
    currentState: StateModel | undefined ,
    createdDate: string,
    canceledReason?: string,
    canceledBy?: UserModel | undefined,
}

type StateWithDisplayName = {
    id?: string
    name?: string
    displayName?: string
    nextInChain?: StateModel[]
    roles?: string[]
    stateFlowType?: string
}

type StateRadioButtonProps = {
    active: boolean,
    variant: string,
    transitionDate?: string
}

export function ResearchStates(props: ResearchStatesProps) {
    const [stateChain, setStateChain] = useState<StateModel[]>([])
    const [currentState, setCurrentState] = useState<StateWithDisplayName>()

    const [stateTransitions, setStateTransitions] = useState<StateTransitionModel[]>([])
    const [dataReady, setDataReady] = useState({
        stateChainReady: false,
        currentStateReady: false,
        stateTransitionsReady: false
    })
    const [isDataFullyReady, setIsDataFullyReady] = useState(false)

    useEffect(() => {
        const isLoadingDone = dataReady.stateChainReady && dataReady.stateTransitionsReady && dataReady.currentStateReady
        if (isLoadingDone) {
            setIsDataFullyReady(true)
        }
    }, [dataReady])

    useEffect(() => {
        if(!props.currentState) return
        const displayName = STATES[props.currentState.name as keyof typeof STATES].name
        setCurrentState({...props.currentState, displayName: displayName})
        setDataReady(prevState => ({...prevState, currentStateReady: true}))
    }, [props.currentState])

    useEffect(() => {
        const states = props.states
            .map(s => ({
                ...s,
                displayName: STATES[s.name as keyof typeof STATES].name
            }))
        setStateChain(states)
        setDataReady(prevState => ({...prevState, stateChainReady: true}))
    }, [props.states])


    useEffect(() => {
        const sort = (st1: StateTransitionModel, st2: StateTransitionModel) =>
            MyUtil.cmp(st1.transitionDate, st2.transitionDate, true)
        const sorted = props.stateTransitions.sort(sort)
        setStateTransitions(sorted)
        setDataReady(prevState => ({...prevState, stateTransitionsReady: true}))
    }, [props.stateTransitions])


    //FIXME REFACTOR THIS DUPLICATE CODE INTO AN UTIL FUNCTION
    function mapStates() {
        if (stateChain.length === 0) return <span>a carregar estados...</span>
        let state = stateChain.find(s => s.stateFlowType === StateFlowTypes.INITIAL)!
        if (state == null) {
            throw new MyError("The state chain doesnt have an initial state!!!!\n currentChain: " + props.states,
                500)
        }
        if (stateChain.find(s => s.stateFlowType === StateFlowTypes.TERMINAL) == null) {
            throw new MyError("The state chain doesnt have a terminal state!!!!\n currentChain: " + props.states,
                500)
        }
        const stateComponents: JSX.Element[] = []

        let variant = getVariantColor(state!, false)
        let elem = createRadioButton(state!, {
            variant,
            active: currentState!.id === state.id
        })
        stateComponents.push(elem)
        do {
            let nextStateId = state!.nextInChain![0].id
            state = stateChain.find(s => s.id === nextStateId)!
            let tprops = getRadioButtonProps(state!)
            elem = createRadioButton(state!, tprops)
            stateComponents.push(elem)
        } while (state!.stateFlowType !== StateFlowTypes.TERMINAL);

        return stateComponents
    }

    function getRadioButtonProps(state: StateWithDisplayName): StateRadioButtonProps {
        const isDisabled = getIsDisabled(state!)
        return {
            active: currentState!.id === state.id,
            variant: getVariantColor(state!, isDisabled)
        }
    }

    function getIsDisabled(state: StateWithDisplayName): boolean {
        return stateTransitions.length === 0 || stateTransitions.every(st => st.newStateId !== state.id)
    }

    function getVariantColor(state: StateWithDisplayName, disabled: boolean = false): string {
        return currentState!.displayName === state.name ? 'primary'
            : disabled ? 'outline-dark' : 'outline-primary'
    }


    function createRadioButton(
        state: StateWithDisplayName,
        tprops: StateRadioButtonProps
    ) {
        return <Form.Group key={`form-group-state-${state.id}`}>
            <Stack direction={"horizontal"} gap={2}>
                <Form.Check
                    key={`radio-${state.id}`}
                    type="radio"
                    name={`radio-${state.id}`}
                    className={""}
                    value={state.name!}
                    disabled
                    checked={tprops.active}
                />
                <Form.Label className={"mt-2"}><span className={"font-bold"}>{state.displayName}</span></Form.Label>
            </Stack>
        </Form.Group>
    }

    return <Container>
        {
            isDataFullyReady ?
                <div>
                    <label style={{fontSize: "1.2rem"}}><b>Estado</b></label>
                    <br/>
                    <Form>
                        {
                            props.canceledReason ?
                            <Container><span className={"text-danger font-bold"}>
                                {`Cancelado na data ${MyUtil.formatDate(props.stateTransitions![0].transitionDate)}, 
                                por`} <a href={`mailto:${props.canceledBy!.email}`}>{props.canceledBy!.name}</a> pelo seguinte motivo:
                                <br/>
                                {props.canceledReason}
                            </span></Container>
                                :
                                mapStates()
                        }
                    </Form>
                </div>
                :
                <div>
                    A carregar...
                </div>
        }
    </Container>
}