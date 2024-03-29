import React, {useEffect, useState} from "react";
import {TimelineEventModel} from "../../../model/proposal/TimelineEventModel";
import {Button, Col, Form, FormGroup, Row, Stack} from "react-bootstrap";
import {EventTypes} from "../../../common/Constants";
import {STATES} from "../../../model/state/STATES";
import {MyUtil} from "../../../common/MyUtil";
import {useParams} from "react-router-dom";
import {StateModel} from "../../../model/state/StateModel";
import {RequiredLabel} from "../../components/RequiredLabel";
import {useToastMsgContext} from "../../context/ToastMsgContext";
import {MyError} from "../../error-view/MyError";


type TimelineProps = {
    possibleStates: StateModel[]
    onEventAdded: (event: TimelineEventModel) => void
}

export function TimelineEventForm(props: TimelineProps) {
    const {proposalId} = useParams()
    const [eventToAdd, setEventToAdd] = useState<TimelineEventModel>({
        completedDate: undefined,
        daysOverDue: 0,
        deadlineDate: "",
        eventDescription: "",
        eventName: "",
        eventType: "",
        id: "",
        isOverDue: false,
        proposalId: proposalId!,
        isAssociatedToState: false,
        stateId: ""
    })

    const {showErrorToastMsg} = useToastMsgContext()
    const [possibleStates, setPossibleStates] = useState<StateModel[]>([])


    useEffect(() => {
        setPossibleStates(props.possibleStates)
    }, [props.possibleStates])

    const [dateAsString, setDateAsString] = useState("")

    const updateState = (key: keyof TimelineEventModel, value: unknown ) =>
        (
            prevState: TimelineEventModel
        ): TimelineEventModel =>
        {
            return ({
                ...prevState,
                [key]: value
            })
        }

    function updateEventToAdd(e: React.ChangeEvent<HTMLInputElement>) {
        const key = e.target.name as keyof TimelineEventModel
        setEventToAdd(updateState(key, e.target.value));
    }

    function handleFormSubmission(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()
        if(eventToAdd.deadlineDate == null) {
            showErrorToastMsg(new MyError("Tem de ter data limite!"))
            return
        }
        eventToAdd.eventType = eventToAdd.isAssociatedToState ? EventTypes.STATES.id : EventTypes.DEADLINES.id
        props.onEventAdded(eventToAdd)
        setEventToAdd({
            completedDate: "",
            daysOverDue: 0,
            deadlineDate: "",
            eventDescription: "",
            eventName: "",
            eventType: "",
            isAssociatedToState: false,
            isOverDue: false,
            stateId: "",
        })
    }

    function handleSelectedState(e: React.ChangeEvent<HTMLSelectElement>) {
        const key = e.target.name as keyof TimelineEventModel
        setEventToAdd(updateState(key, e.target.value))
    }

    function showStateSelection() {
        return (

            <Form.Select
                key={"state-associated-selection"}
                required
                aria-label="state selection"
                name={"stateId"}
                defaultValue={""}
                onChange={handleSelectedState}
            >
                <option value={""} disabled>-Selecionar estado-</option>
                {possibleStates
                    .map((s) => <option key={s.id} value={s.id}>{STATES[s.name as keyof typeof STATES].name}</option>)
                }
            </Form.Select>
        )
    }

    function onDateChanged(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setDateAsString(e.target.value)
        const date = e.target.value
        setEventToAdd(updateState("deadlineDate", date))
    }

    return (
        <Form onSubmit={handleFormSubmission}>
            <fieldset className={"border p-3"}>
                <legend className={"float-none w-auto p-2"}>Adicionar deadline</legend>
                <Row>
                    <Col>
                        <FormGroup>
                            <Stack direction={"horizontal"} gap={2}>
                                <Form.Label>Associar a um estado?</Form.Label>
                                <Form.Check
                                    key={"switch-partnerships"}
                                    type={"switch"}
                                    className={"mb-1"}
                                    name={"isStateEvent"}
                                    checked={eventToAdd.isAssociatedToState}
                                    onChange={(e) => setEventToAdd(prevState => ({...prevState,isAssociatedToState: e.target.checked}))}
                                />
                            </Stack>
                        </FormGroup>
                        {eventToAdd.isAssociatedToState ?
                            showStateSelection()
                            : <></>
                        }
                    </Col>
                    <Col>
                        <Form.Group>
                            <RequiredLabel label={"Título"}/>
                            <Form.Control
                                required
                                type={"text"}
                                name={"eventName"}
                                value={eventToAdd.eventName}
                                onChange={updateEventToAdd}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <RequiredLabel label={"Data limite"}/>
                            <Form.Control
                                required
                                min={MyUtil.getTodayDate()}
                                type={"date"}
                                value={dateAsString}
                                onChange={onDateChanged}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className={"mt-2"}>
                    <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as={"textarea"}
                            rows={2}
                            name={"eventDescription"}
                            value={eventToAdd.eventDescription}
                            placeholder={"Descrição opcional"}
                            onChange={updateEventToAdd}
                            />
                    </Form.Group>
                </Row>
                <Button type={"submit"} className={"mt-3"}>
                    Adicionar
                </Button>
            </fieldset>
        </Form>
    )
}