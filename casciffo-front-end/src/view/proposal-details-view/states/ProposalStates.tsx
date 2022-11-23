import {Button, ButtonGroup, Container, OverlayTrigger, Stack, ToggleButton, Tooltip} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {MyUtil} from "../../../common/MyUtil";
import {StateModel} from "../../../model/state/StateModel";
import {TimelineEventModel} from "../../../model/proposal/TimelineEventModel";
import {StateTransitionModel} from "../../../model/state/StateTransitionModel";
import {StateFlowTypes} from "../../../common/Constants";
import {STATES} from "../../../model/state/STATES";
import {MyError} from "../../error-view/MyError";

type StateProps = {
    onAdvanceClick: (currentId: string, currStateName: string, nextStateId:string) => void
    submittedDate: string
    timelineEvents: TimelineEventModel[]
    stateTransitions: StateTransitionModel[]
    states: StateModel[],
    currentStateId: number,
    isProtocolValidated?: boolean
}

type StateToggleButtonProps = {
    active: boolean;
    transitionDate: string,
    variant: string,
    disabled: boolean,
    deadlineDate?: string
}

type StateWithDisplayName = {
    id?: string
    name?: string
    displayName?: string
    nextInChain?: StateModel[]
    roles?: string[]
    stateFlowType?: string
}

export function ProposalStateView(props: StateProps) {
    const [currentState, setCurrentState] = useState<StateWithDisplayName>({})
    const [stateChain, setStateChain] = useState<StateWithDisplayName[]>([])
    const [timelineEvents, setTimelineEvents] = useState<TimelineEventModel[]>([])
    const [stateTransitions, setStateTransitions] = useState<StateTransitionModel[]>([])

    useEffect(() => {
        if(stateChain == null || stateChain.length === 0) return
        const state = stateChain.find(sc => parseInt(sc.id!) === props.currentStateId)!
        setCurrentState(state)
    }, [stateChain, props.currentStateId])
    
    useEffect(() => {
        const states = props.states
            .map(s => ({
                ...s,
                displayName: STATES[s.name as keyof typeof STATES].name
            }))
        setStateChain(states)
    }, [props.states])

    useEffect(() => {
        setTimelineEvents(props.timelineEvents)
    }, [props.timelineEvents])

    useEffect(() => {
        const sort = (st1: StateTransitionModel, st2: StateTransitionModel) => MyUtil.cmp(st1.transitionDate, st2.transitionDate, true)
        const sorted = props.stateTransitions.sort(sort)
        setStateTransitions(sorted)
    }, [props.stateTransitions])


    const advanceState = () => {
        if(!currentState.nextInChain || currentState.nextInChain.length < 1) {
            throw new MyError("Não existe estado próximo possível!", 400)
        }
        if(currentState.nextInChain[0].name === STATES.VALIDADO.id && (props.isProtocolValidated != null && !props.isProtocolValidated)) {
            alert("O Protocolo tem de estar validado para avançar!")
            return
        }
        props.onAdvanceClick(currentState.id!, currentState.name!, currentState.nextInChain[0].id!)
    }

    function mapStates() {
        if(stateChain.length === 0) return <span>a carregar estados...</span>
        let state = stateChain.find(s => s.stateFlowType === StateFlowTypes.INITIAL)!
        if(state == null) {
            throw new MyError("The state chain doesnt have an initial state!!!!\n currentChain: " + props.states,
                500)
        }
        if(stateChain.find(s => s.stateFlowType === StateFlowTypes.TERMINAL) == null) {
            throw new MyError("The state chain doesnt have a terminal state!!!!\n currentChain: " + props.states,
                500)
        }
        const stateComponents: JSX.Element[] = []

        let variant = getVariantColor(state!, false)
        let elem =  createToggleButton(state!, {transitionDate: props.submittedDate, variant, disabled: false, active: currentState.id === state.id})
        stateComponents.push(elem)
        do {
            let nextStateId = state!.nextInChain![0].id
            state = stateChain.find(s => s.id === nextStateId)!
            let tprops = getToggleButtonProps(state!)
            elem =  createToggleButton(state!, tprops)
            stateComponents.push(elem)
        } while (state!.stateFlowType !== StateFlowTypes.TERMINAL);

        return stateComponents
    }

    function getToggleButtonProps(state: StateWithDisplayName): StateToggleButtonProps {
        const isDisabled = getIsDisabled(state!)
        return {
            active: currentState.id === state.id,
            transitionDate: getTransitionDate(state!),
            deadlineDate: getDeadlineDateForState(state!),
            disabled: isDisabled,
            variant: getVariantColor(state!, isDisabled)
        }
    }

    function getIsDisabled(state: StateWithDisplayName): boolean {
        return stateTransitions.length === 0 || stateTransitions.every(st => st.newStateId !== state.id)
    }

    function getVariantColor(state: StateWithDisplayName, disabled: boolean = false): string {
        return currentState.displayName === state.name ? 'primary'
            : disabled ? 'outline-dark' : 'outline-primary'
    }

    function getTransitionDate(state: StateWithDisplayName) {
        let transition;

        if(state.name === STATES.VALIDADO.id) {
            transition = stateTransitions.find(st => st.newStateId === state.id)
        } else {
            transition = stateTransitions.find(st => st.previousStateId === state.id)
        }

        if (transition == null) return "---"

        return MyUtil.formatDate(transition!.transitionDate)
    }

    function getDeadlineDateForState(state: StateWithDisplayName) {
        const event = timelineEvents.find(e => (e.stateId === state.id))
        if (event === undefined) {
            return "Limite: ---"
        }
        return "Limite: " + MyUtil.formatDate(event!.deadlineDate!)
    }

    function createToggleButton(
        state: StateWithDisplayName,
        tprops: StateToggleButtonProps
    ) {
        return <ToggleButton
            key={`${state.id}`}
            type="radio"
            variant={tprops.variant}
            name={`radio-${state.id}`}
            value={state.name!}
            style={{pointerEvents: "none"}} //disable click ability
            disabled={tprops.disabled}
            active={tprops.active}
        >
            <Stack direction={"vertical"}>
                <span>{state.displayName}</span>
                <span>{tprops.transitionDate}</span>
                {(tprops.deadlineDate && <span>{tprops.deadlineDate}</span>) || <br/>}
                <span>{state.roles!.join(',')}</span>
            </Stack>
        </ToggleButton>;
    }

    return (
        <Container className={"flex border-bottom"}>
            <Container>
                {props.isProtocolValidated != null
                    && !props.isProtocolValidated
                    &&
                    <OverlayTrigger
                        key={"protocol-warning"}
                        placement={"right"}
                        overlay={
                            <Tooltip id={`tooltip-right`}>
                                A proposta não consegue atingir o estado Validado enquanto este não estiver validado.
                            </Tooltip>
                        }
                    >
                        <Button as={"span"} variant={"outline-warning"} disabled>O protocolo ainda não está validado. ⚠️</Button>
                    </OverlayTrigger>
                }<br/>
                <label style={{fontSize: "1.2rem"}}><b>Estado</b></label>
                <Button className={"float-end mb-2"} variant={"outline-secondary"} onClick={advanceState}
                disabled={props.stateTransitions?.some(s => s.newState!.name === 'VALIDADO'/*s.newState!.stateFlowType === "TERMINAL"*/)}>
                    Progredir estado
                </Button>
                <br/>
            </Container>
            <Container>
                <ButtonGroup className={"mb-3"} style={{width: "100%"}}>
                    {mapStates()}
                </ButtonGroup>
            </Container>
        </Container>
    )
}