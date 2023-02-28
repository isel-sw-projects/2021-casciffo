import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Container, OverlayTrigger, Stack, ToggleButton, Tooltip} from "react-bootstrap";
import {ResearchAggregateService} from "../../../services/ResearchAggregateService";
import {StateModel} from "../../../model/state/StateModel";
import {StateTransitionModel} from "../../../model/state/StateTransitionModel";
import {useToastMsgContext} from "../../context/ToastMsgContext";
import {useErrorHandler} from "react-error-boundary";
import {STATES} from "../../../model/state/STATES";
import {MyUtil} from "../../../common/MyUtil";
import {MyError} from "../../error-view/MyError";
import {StateFlowTypes} from "../../../common/Constants";
import {Roles} from "../../../model/role/Roles";

type Props = {
    service: ResearchAggregateService
    transitions: StateTransitionModel[]
    addendaId: string
    currentStateId: string
    submittedDate: string
    onAdvanceClick: (currentId: string, currStateName: string, nextStateId:string) => void
    onCancel: (reason: string) => void
}

type StateWithDisplayName = {
    id?: string
    name?: string
    displayName?: string
    nextInChain?: StateModel[]
    roles?: string[]
    stateFlowType?: string
}

type StateToggleButtonProps = {
    active: boolean;
    transitionDate: string,
    variant: string,
    disabled: boolean
}

export function AddendaStates(props: Props) {

    const {showErrorToastMsg} = useToastMsgContext()
    const [showCancelPopup, setShowCancelPopup] = useState(false)
    const [stateChain, setStateChain] = useState<StateWithDisplayName[]>([])
    const [transitions, setTransitions] = useState<StateTransitionModel[]>([])
    const [currentState, setCurrentState] = useState<StateWithDisplayName>({})
    const errorHandler = useErrorHandler()
    
    useEffect(() => {
        props.service
            .fetchAddendaStateChain()
            .then(states => {
                const mappedStates = states.map(s => ({
                    ...s,
                    displayName: STATES[s.name as keyof typeof STATES].name
                }))
                setStateChain(mappedStates)
                setCurrentState(mappedStates.find(s => s.id! === props.currentStateId)!)
            })
            .catch(errorHandler)
    }, [errorHandler, props.currentStateId, props.service])

    useEffect(() => {
        const sort = (st1: StateTransitionModel, st2: StateTransitionModel) => MyUtil.cmp(st1.transitionDate, st2.transitionDate, true)
        const sorted = props.transitions.sort(sort)
        setTransitions(sorted)
    }, [props.transitions])

    const advanceState = () => {
        if(!currentState.nextInChain || currentState.nextInChain.length < 1) {
            throw new MyError("Não existe estado próximo possível!", 400)
        }
        props.onAdvanceClick(currentState.id!, currentState.name!, currentState.nextInChain[0].id!)
    }

    function mapStates() {
        if(stateChain.length === 0) return <span>a carregar estados...</span>
        let state = stateChain.find(s => s.stateFlowType === StateFlowTypes.INITIAL)!
        if(state == null) {
            throw new MyError("The state chain doesnt have an initial state!!!!\n currentChain: " + stateChain,
                500)
        }
        if(stateChain.find(s => s.stateFlowType === StateFlowTypes.TERMINAL) == null) {
            throw new MyError("The state chain doesnt have a terminal state!!!!\n currentChain: " + stateChain,
                500)
        }
        const stateComponents: JSX.Element[] = []

        let variant = getVariantColor(state!, false)
        let elem =  createToggleButton(state!, {transitionDate: MyUtil.formatDate(props.submittedDate), variant, disabled: false, active: currentState.id === state.id})
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
            disabled: isDisabled,
            variant: getVariantColor(state!, isDisabled)
        }
    }

    function getIsDisabled(state: StateWithDisplayName): boolean {
        return transitions.length === 0 || transitions.every(st => st.newStateId !== state.id)
    }

    function getVariantColor(state: StateWithDisplayName, disabled: boolean = false): string {
        return currentState.id === state.id ? 'primary'
            : disabled ? 'outline-dark' : 'outline-primary'
    }

    function getTransitionDate(state: StateWithDisplayName) {
        let transition;

        if(state.name === STATES.VALIDADO.id) {
            transition = transitions.find(st => st.newStateId === state.id)
        } else {
            transition = transitions.find(st => st.previousStateId === state.id)
        }

        if (transition == null) return "---"

        return MyUtil.formatDate(transition!.transitionDate)
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
                <span>{state.roles!.filter(sr => sr !== Roles.SUPERUSER.id).join(',')}</span>
            </Stack>
        </ToggleButton>;
    }

    return <Container className={"mt-5 mb-4 flex border-bottom"}>
            <label style={{fontSize: "1.2rem"}}><b>Estado</b></label>
            <Button className={"float-end mb-2"} variant={"outline-secondary"} onClick={advanceState}
                    disabled={transitions.some(s => s.newState!.name === 'VALIDADO' /* todo check this magic string s.newState!.stateFlowType === "TERMINAL"*/)}>
                Progredir estado
            </Button>
            <br/>
        <Container>
            <ButtonGroup className={"mb-3"} style={{width: "100%"}}>
                {mapStates()}
            </ButtonGroup>
        </Container>
    </Container>
}