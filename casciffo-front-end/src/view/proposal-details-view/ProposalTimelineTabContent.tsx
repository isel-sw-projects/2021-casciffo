import React, {useCallback, useEffect, useState} from "react";
import {TimelineEventModel} from "../../model/TimelineEventModel";
import {SearchComponent} from "../util-view-components/SearchComponent";
import {Button, Col, Container, Form, Row, Stack, Table} from "react-bootstrap";
import {EventTypes, ResearchTypes} from "../../common/Constants";
import {TimelineEventForm} from "./TimelineEventForm";
import {Chrono} from "react-chrono";
import {Util} from "../../common/Util";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {useParams} from "react-router-dom";
import {BiCheck, BiCheckboxMinus} from "react-icons/bi";

type TimelineProps = {
    timelineEvents: Array<TimelineEventModel>,
    setNewTimeLineEvent: (t: TimelineEventModel) => void,
    service: ProposalAggregateService
}

type ChronoItemType = {
    title: string,
    cardTitle: string,
    cardSubtitle: string,
    cardDetailedText: string
}

export function ProposalTimelineTabContent(props: TimelineProps) {
    const [query, setQuery] = useState("")
    const [selectedEventType, setSelectedEventType] = useState(EventTypes.ALL.id)
    const [showForm, setShowForm] = useState(true)
    const [timelineEvents, setTimelineEvents] = useState<TimelineEventModel[]>([])
    const [hasEvents, setHasEvents] = useState(false)
    const headers = ["Título", "Data completo", "Data limite", "Descrição", "Completar"]
    const {proposalId} = useParams()

    const sortEvents = (a: TimelineEventModel, b: TimelineEventModel) => Util.cmp(a.deadlineDate!, b.deadlineDate!)

    useEffect(() => {
        props.service
            .fetchProposalTimelineEvents(proposalId!)
            .then(e => e.sort(sortEvents))
            .then(e => {
                setTimelineEvents(e);
                return e
            })
            .then(items => {
                setHasEvents(items.length !== 0)
                return items
            }).then(e => {
                if(e.length !== 0) {
                    setDateInterval(
                        {
                            start: Util.formatDate(e[0].deadlineDate!),
                            end: Util.formatDate(e[e.length - 1].deadlineDate!)
                        })
                }
        })
    }, [proposalId, props.service])

    function filterByEventType(e: TimelineEventModel): boolean {
        return (e.eventType === selectedEventType || selectedEventType === EventTypes.ALL.id)
    }

    function getCompletedButtonVariant(e: TimelineEventModel) {
        //fixme dont show success when completedDate is overdue
        return Util.isNullOrUndefined(e.completedDate) ? "outline-primary" :
            Util.cmp(e.completedDate, e.deadlineDate) > 0 ? "outline-warning" : "outline-success";
    }

    function mapEventsToRow() {
        let events = props.timelineEvents

        if(events === undefined || events.length === 0) {
            return <tr key={"row-no-events"}><td colSpan={5}>Sem histórico de eventos</td></tr>
        }

        function filterEventNameIsLike(e: TimelineEventModel) {
            return e.eventName.toLocaleLowerCase().includes(query.toLocaleLowerCase()) && filterByEventType(e)
        }

        function getColor(e: TimelineEventModel) {
            const cmp = Util.cmp(e.deadlineDate, e.completedDate)
            if (cmp === 0) return "#0BDA51" //light green
            if (cmp < 0) return "#FF9694" //light red
            return "inherit"
        }

        const updateTimelineEvent = (e: TimelineEventModel) => () => {
            props.service.updateTimelineEvent(proposalId!, e.id!, true)
                .then(event => timelineEvents.map(ev => ev.id !== e.id ? ev : event))
                .then(setTimelineEvents)
        }

        return events
            .filter(filterEventNameIsLike)
            .map(e =>
                <tr key={e.id}>
                    <td>{e.eventName}</td>
                    <td style={{backgroundColor: getColor(e)}}>
                        {Util.isNullOrUndefined(e.completedDate) ? "":Util.formatDate(e.completedDate!)}
                    </td>
                    <td>{Util.formatDate(e.deadlineDate!)}</td>
                    <td>{e.eventDescription}</td>
                    <td className={"text-center"}>
                        <Button
                            variant={getCompletedButtonVariant(e)}
                            disabled={!Util.isNullOrUndefined(e.completedDate)}
                            onClick={updateTimelineEvent(e)}
                        >
                            {Util.isNullOrUndefined(e.completedDate)
                                ? <BiCheck className={"d-flex"} size={25}/>
                                : Util.cmp(e.completedDate, e.deadlineDate) > 0
                                    ? <BiCheckboxMinus className={"d-flex"} size={25}/>
                                    : <BiCheck className={"d-flex"} size={25}/>
                            }
                        </Button>
                    </td>
                </tr>
            )
    }

    function handleEventTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedEventType(event.target.value)
    }

    //TODO add some nice looking UI changes to the addTimelineEvent action
    // function handleShowFormChange() {
    //     if(showForm)
    // }
    const isBetweenDateInterval = (e: TimelineEventModel): boolean => {
        return (Util.cmp(Util.formatStringToArrayDate(dateInterval.start), e.deadlineDate) <= 0
            && Util.cmp(Util.formatStringToArrayDate(dateInterval.end), e.deadlineDate) >= 0)
    }

    function mapToChronoItem(): ChronoItemType[] {

        function filterEventsByTypeAndDate(e: TimelineEventModel) {
            return  isBetweenDateInterval(e) && filterByEventType(e);
        }

        return timelineEvents
            .filter(filterEventsByTypeAndDate)
            .map(event => ({
                title: Util.formatDateWithMonthName(event.deadlineDate!),
                cardTitle: event.eventName,
                cardSubtitle: event.eventDescription === undefined ? "" : event.eventDescription,
                cardDetailedText: event.eventDescription === undefined ? "" : event.eventDescription,
            }))
    }

    function handleEventSubmit(event: TimelineEventModel) {
        // props.setNewTimeLineEvent(event)
        props.service
            .saveTimelineEvent(proposalId!, event)
            .then(event => setTimelineEvents(prevState => ([...prevState, event].sort(sortEvents))))
    }

    type DateInterval = {
        start: string,
        end: string
    }

    const [dateInterval, setDateInterval] = useState<DateInterval>({start:"", end:""})

    function onChangeDateInterval(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const key = e.target.name as keyof DateInterval
        setDateInterval(prevState => ({
            ...prevState,
            [key]: e.target.value
        }))
    }

    return (
        <React.Fragment>
            {hasEvents ?
                <Row>
                    <div style={{width: "30%", height:"auto", paddingTop: "4rem"}}>
                        <Form.Group className={"mb-4"} style={{position:"relative"}}>
                            <Stack direction={"horizontal"} gap={3}>
                                <Form.Label>A visualizar</Form.Label>
                                <Form.Select
                                    style={{width:"60%"}}
                                    key={"event-type-id"}
                                    required
                                    aria-label="event type selection"
                                    name={"eventType"}
                                    defaultValue={EventTypes.ALL.id}
                                    onChange={handleEventTypeChange}
                                >
                                    {Object.values(EventTypes).map((rt) => (
                                        <option key={rt.id} value={rt.id}>{rt.name}</option>
                                    ))}
                                </Form.Select>
                            </Stack>
                        </Form.Group>

                        <Form.Label className={"capitalize"}>Pesquisa entre datas</Form.Label>
                        <Stack direction={"horizontal"} gap={4}>
                            <div style={{width:"40%"}}>
                                <Form.Group>
                                    <Form.Label>De</Form.Label>
                                    <Form.Control
                                        required
                                        type={"date"}
                                        name={"start"}
                                        value={dateInterval.start}
                                        onChange={onChangeDateInterval}
                                    />
                                </Form.Group>
                            </div>
                            <div style={{width:"40%"}}>
                                <Form.Group>
                                    <Form.Label>Até</Form.Label>
                                    <Form.Control
                                        required
                                        type={"date"}
                                        name={"end"}
                                        value={dateInterval.end}
                                        onChange={onChangeDateInterval}
                                    />
                                </Form.Group>
                            </div>
                        </Stack>
                    </div>

                    <div style={{ width: "70%", height: "300px" }}>
                        <Chrono
                            disableAutoScrollOnClick cardHeight={100} allowDynamicUpdate cardPositionHorizontal={"TOP"}
                            items={mapToChronoItem()}
                            mode={"HORIZONTAL"}
                        />
                    </div>
                </Row>
                : <p>Sem eventos para mostrar</p>
            }


            <Container className={"float-start mb-5"} style={{width: "60%"}}>
                {/*<Container className={"content"}>*/}
                {/*    <Button onClick={handleShowFormChange}>{showForm ? "Cancelar" : "Adicionar evento à cronologia"}</Button>*/}
                {/*</Container>*/}
                {showForm ?
                    <TimelineEventForm
                        onEventAdded={handleEventSubmit}/>
                    :<></>
                }
            </Container>
            <br/>
            <Container className={"justify-content-evenly mb-4 float-start p-0"} style={{width:"50%"}}>
                <SearchComponent handleSubmit={setQuery}/>
            </Container>



            <Table striped bordered hover size={"sm"}>
                <colgroup>
                    <col span={1} style={{width: "20%"}}/>
                    <col span={1} style={{width: "15%"}}/>
                    <col span={1} style={{width: "10%"}}/>
                    <col span={1} style={{width: "50%"}}/>
                    <col span={1} style={{width: "5%"}}/>
                </colgroup>
                <thead key={"timeline-history-headers"}>
                <tr>
                    {headers.map((h,i) => <th key={i}>{h}</th>)}
                </tr>
                </thead>

                <tbody>
                    {mapEventsToRow()}
                </tbody>
            </Table>
        </React.Fragment>
    )
}