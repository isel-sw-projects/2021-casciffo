import {Button, ButtonGroup, Container, OverlayTrigger, Stack, ToggleButton, Tooltip} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Util} from "../../common/Util";
import {StateModel} from "../../model/state/StateModel";
import {TimelineEventModel} from "../../model/TimelineEventModel";
import {StateTransitionModel} from "../../model/state/StateTransitionModel";
import {StateFlowTypes} from "../../common/Constants";
import {STATES} from "../../model/state/STATES";
import {MyError} from "../error-view/MyError";

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

type SelectedState = {
    stateName: string,
    stateDisplayName: string
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
                displayName: Object.values(STATES).find(st => st.id === s.name)!.name
            }))
        setStateChain(states)
    }, [props.states])

    useEffect(() => {
        setTimelineEvents(props.timelineEvents)
    }, [props.timelineEvents])

    useEffect(() => {
        const sort = (st1: StateTransitionModel, st2: StateTransitionModel) => Util.cmp(st1.transitionDate, st2.transitionDate, true)
        const sorted = props.stateTransitions.sort(sort)
        setStateTransitions(sorted)
        // const lastTransitionName = props.stateTransitions.length === 0 ?
        //     STATES.SUBMETIDO.id
        //     :
        //     sorted[props.stateTransitions.length-1].newState!.name;
        // const name = Object.values(STATES).find(s => s.id === lastTransitionName)!.name
        // setCurrentState({
        //     stateName: lastTransitionName,
        //     stateDisplayName: name
        // })
    }, [props.stateTransitions])


    const advanceState = () => {
        // const currentState = stateChain.find(sc => sc.name === currentState.stateName)!

        // const nextStateId = stateTransitions.length > 0 ?
        //     stateChain.find(s => s.id === stateTransitions[stateTransitions.length-1].newState!.id!)!.nextInChain![0].id!
        //     :
        //     stateChain[0].nextInChain![0].id!
        console.log(currentState)
        if(!currentState.nextInChain || currentState.nextInChain.length < 1) {
            throw new MyError("Não existe estado próximo possível!", 400)
        }
        props.onAdvanceClick(currentState.id!, currentState.name!, currentState.nextInChain[0].id!)
    }

    function mapStates() {
        if(stateChain.length === 0) return <span>a carregar estados...</span>
        let state = stateChain.find(s => s.stateFlowType === StateFlowTypes.INITIAL)!
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
        const transition = stateTransitions.find(st => st.newStateId === state.id)

        if (transition == null) return "---"

        return Util.formatDate(transition!.transitionDate)
    }

    function getDeadlineDateForState(state: StateWithDisplayName) {
        const event = timelineEvents.find(e => (e.stateName === state.name))
        if (event === undefined) {
            return "Limite: ---"
        }
        return "Limite: " + Util.formatDate(event!.deadlineDate!)
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
                {/*TODO change back-end to include transition type flow [INITIAL, PROGRESS, TERMINAL] in transitions*/}
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

// function getDeadlineDateForState(stateName: string) {
//     const event = timelineEvents?.find(e => e.stateName === stateName)
//     if (event === undefined) {
//         return "Limite: ---"
//     }
//     return "Limite: " + Util.formatDate(event!.deadlineDate!)
// }
//
// function getTransitionDate(stateName: string) {
//     const transition = stateTransitions?.find(st => st.newState?.name === stateName)
//
//     if (transition == null) return <span>{"---"}</span>
//
//     return <span>{Util.formatDate(transition!.transitionDate)}</span>
// }
// <ToggleButton
//     key={`initial-state`}
//     id={`radio-0`}
//     type="radio"
//     variant={selectedState === STATES.SUBMETIDO.id ? 'primary' : 'outline-primary'}
//     name="radio"
//     value={STATES.SUBMETIDO.id}
//     checked={selectedState === STATES.SUBMETIDO.id}
//     onChange={(e) => setSelectedState(e.currentTarget.value)}
// >
//     <Stack direction={"vertical"}>
//         <span>{STATES.SUBMETIDO.name}</span>
//         <span>{Util.formatDate(props.proposal.createdDate!)}</span>
//         <br/>
//         <span>{STATES.SUBMETIDO.owner}</span>
//     </Stack>
// </ToggleButton>
// {Util.proposalStates
//     .map((state, i) => (
//         <ToggleButton
//             key={`${state}-${i}`}
//             id={`radio-${i}`}
//             type="radio"
//             variant={props.proposal.stateTransitions?.every(st => st.newState?.name !== state.id) ? 'outline-dark' : 'outline-primary'}
//             name="radio"
//             value={state.id}
//             checked={selectedState === state.id}
//             disabled={props.proposal.stateTransitions?.every(st => st.newState?.name !== state.id)}
//             onChange={(e) => setSelectedState(e.currentTarget.value)}
//         >
//             <Stack direction={"vertical"}>
//                 <span>{state.name}</span>
//                 {getTransitionDate(state.id)}
//                 <span>{getDeadlineDateForState(state.id)}</span>
//                 <span>{state.owner}</span>
//             </Stack>
//         </ToggleButton>
//     ))}