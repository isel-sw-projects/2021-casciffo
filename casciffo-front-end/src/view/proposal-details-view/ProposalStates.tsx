import {Button, ButtonGroup, Container, Stack, ToggleButton} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Util} from "../../common/Util";
import {StateModel} from "../../model/state/StateModel";
import {TimelineEventModel} from "../../model/TimelineEventModel";
import {StateTransitionModel} from "../../model/state/StateTransitionModel";
import {StateFlowTypes} from "../../common/Constants";
import {STATES} from "../../model/state/STATES";

type StateProps = {
    onAdvanceClick: () => void
    submittedDate: string
    timelineEvents: TimelineEventModel[]
    stateTransitions: StateTransitionModel[]
    states: StateModel[]
}

type StateToggleButtonProps = {
    transitionDate: string,
    variant: string,
    disabled: boolean,
    deadlineDate?: string
}

export function ProposalStateView(props: StateProps) {
    const [selectedState, setSelectedState] = useState("")
    const [stateChain, setStateChain] = useState<StateModel[]>([])
    const [timelineEvents, setTimelineEvents] = useState<TimelineEventModel[]>([])
    const [stateTransitions, setStateTransitions] = useState<StateTransitionModel[]>([])

    useEffect(() => {
        setStateChain(props.states)
    }, [props.states])

    useEffect(() => {
        setTimelineEvents(props.timelineEvents)
    }, [props.timelineEvents])

    useEffect(() => {
        const sort = (st1: StateTransitionModel, st2: StateTransitionModel) => Util.cmp(st1.transitionDate, st2.transitionDate, true)
        setStateTransitions(props.stateTransitions)
        const lastTransition = props.stateTransitions.length === 0 ?
            'SUBMETIDO'
            :
            props.stateTransitions.sort(sort)[props.stateTransitions.length-1].newState!.name;
        const name = Object.values(STATES).find(s => s.id === lastTransition)!.name
        setSelectedState(name)
    }, [props.stateTransitions])


    function mapStates() {
        if(stateChain.length === 0) return <span>a carregar estados...</span>
        let state = stateChain.find(s => s.stateFlowType === StateFlowTypes.INITIAL)
        if(stateChain.find(s => s.stateFlowType === StateFlowTypes.TERMINAL) == null) {
            console.log("The state chain doesnt have a terminal state!!!!\n currentChain: " + props.states)
            return <span>Error loading states... Contact developer</span>
        }
        const stateComponents: JSX.Element[] = []

        let variant = getVariantColor(state!, false)
        let elem =  createToggleButton(state!, {transitionDate: props.submittedDate, variant, disabled: false})
        stateComponents.push(elem)

        do {
            let nextStateId = state!.nextInChain![0].id
            state = props.states!.find(s => s.id === nextStateId)
            let tprops = getToggleButtonProps(state!)
            elem =  createToggleButton(state!, tprops)
            stateComponents.push(elem)
        } while (state!.stateFlowType !== StateFlowTypes.TERMINAL);

        return stateComponents
    }

    function getToggleButtonProps(state: StateModel): StateToggleButtonProps {
        const isDisabled = getIsDisabled(state!)
        return {
            transitionDate: getTransitionDate(state!),
            deadlineDate: getDeadlineDateForState(state!),
            disabled: isDisabled,
            variant: getVariantColor(state!, isDisabled)
        }
    }

    function getIsDisabled(state: StateModel): boolean {
        return stateTransitions.length === 0 || stateTransitions.every(st => st.newStateId !== state.id)
    }

    function getVariantColor(state: StateModel, disabled: boolean = false): string {
        return selectedState === state.name ? 'primary'
            : disabled ? 'outline-dark' : 'outline-primary'
    }

    function getTransitionDate(state: StateModel) {
        const transition = stateTransitions.find(st => st.newStateId === state.id)

        if (transition == null) return "---"

        return Util.formatDate(transition!.transitionDate)
    }

    function getDeadlineDateForState(state: StateModel) {
        //TODO CHANGE IT SO THIS ISNT AS BAD, JUST ADD STATE ID TO TIMELINE EVENT EZ
        const stateOriginalName = Object.values(STATES).find(s => s.name === state.name)
        const event = timelineEvents.find(e => (e.stateName === stateOriginalName!.id))
        if (event === undefined) {
            return "Limite: ---"
        }
        return "Limite: " + Util.formatDate(event!.deadlineDate!)
    }

    function createToggleButton(
        state: StateModel,
        tprops: StateToggleButtonProps
    ) {
        return <ToggleButton
            key={`${state.id}`}
            type="radio"
            variant={tprops.variant}
            name="radio"
            value={state.name}
            checked={selectedState === state.name}
            disabled={tprops.disabled}
        >
            <Stack direction={"vertical"}>
                <span>{state.name}</span>
                <span>{tprops.transitionDate}</span>
                {(tprops.deadlineDate && <span>{tprops.deadlineDate}</span>) || <br/>}
                <span>{state.roles!.join(',')}</span>
            </Stack>
        </ToggleButton>;
    }

    return (
        <Container className={"border-bottom"}>
            <Container>
                <label style={{fontSize: "1.2rem"}}><b>Estado</b></label>
                {/*TODO change back-end to include transition type flow [INITIAL, PROGRESS, TERMINAL] in transitions*/}
                <Button className={"float-end mb-2"} variant={"outline-secondary"} onClick={props.onAdvanceClick}
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