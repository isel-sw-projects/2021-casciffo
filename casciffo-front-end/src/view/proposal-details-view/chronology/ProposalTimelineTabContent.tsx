import React, {useEffect, useState} from "react";
import {TimelineEventModel} from "../../../model/proposal/TimelineEventModel";
import {SearchComponent} from "../../components/SearchComponent";
import {Button, Col, Container, Form, Row, Stack, Table} from "react-bootstrap";
import {EventTypes} from "../../../common/Constants";
import {TimelineEventForm} from "./TimelineEventForm";
import {Chrono} from "react-chrono";
import {MyUtil} from "../../../common/MyUtil";
import ProposalAggregateService from "../../../services/ProposalAggregateService";
import {useParams} from "react-router-dom";
import {BiCheck} from "react-icons/bi";
import {StateModel} from "../../../model/state/StateModel";

type TimelineProps = {
    possibleStates: StateModel[]
    timelineEvents: Array<TimelineEventModel>,
    setNewTimeLineEvent: (t: TimelineEventModel) => void,
    service: ProposalAggregateService
    updateTimelineEvent: (e: TimelineEventModel) => void;
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
    const [showForm, setShowForm] = useState(false)
    const [showTimeline, setShowTimeline] = useState(true)
    const [timelineEvents, setTimelineEvents] = useState<TimelineEventModel[]>([])
    const [hasEvents, setHasEvents] = useState(false)
    const headers = ["Título", "Data completo", "Data limite", "Descrição", "Completar"]
    const {proposalId} = useParams()

    const sortEvents = (a: TimelineEventModel, b: TimelineEventModel) => MyUtil.cmp(a.deadlineDate!, b.deadlineDate!)

    useEffect(() => {
        const sortedEvents = props.timelineEvents.sort(sortEvents)
        setTimelineEvents(sortedEvents)
        setHasEvents(sortedEvents.length !== 0)
        if(sortedEvents.length > 2) {
            setDateInterval({
                start: MyUtil.formatDate(sortedEvents[0].deadlineDate!),
                end: MyUtil.formatDate(sortedEvents[sortedEvents.length - 1].deadlineDate!),
                hasBeenSet: true
            })
        }
    }, [proposalId, props.timelineEvents])

    function filterByEventType(e: TimelineEventModel): boolean {
        return (e.eventType === selectedEventType || selectedEventType === EventTypes.ALL.id)
    }

    function getCompletedButtonVariant(e: TimelineEventModel) {
        return e.completedDate == null ? "outline-primary" :
            MyUtil.cmp(e.completedDate, e.deadlineDate) > 0 ? "outline-danger" : "outline-success";
    }

    function mapEventsToRow() {

        if(timelineEvents.length === 0) {
            return <tr key={"row-no-events"}><td colSpan={5}>Sem histórico de eventos</td></tr>
        }

        const filterEventNameIsLike = (e: TimelineEventModel) =>
            (new RegExp(`${query}.*`,"gi")).test(e.eventName) && filterByEventType(e)


        const getColor = (e: TimelineEventModel) => {
            if(e.completedDate == null) return "inherit"
            return MyUtil.cmp(e.deadlineDate, e.completedDate) < 0
                ? "#FF9694" //light red
                : "#0BDA51" //light green
        }

        const updateTimelineEvent = (e: TimelineEventModel) => () => {
            props.updateTimelineEvent(e)
        }

        const createCompleteButtonForEvent = (e: TimelineEventModel) =>
            <Button
                variant={getCompletedButtonVariant(e)}
                disabled={e.completedDate != null}
                onClick={updateTimelineEvent(e)}
            >
                <BiCheck className={"d-flex"} size={25}/>
            </Button>;

        const mapToRowElement = (e: TimelineEventModel) =>
            <tr key={e.id}>
                <td>{e.eventName}</td>
                <td style={{backgroundColor: getColor(e)}}>
                    {e.completedDate == null ? "" : MyUtil.formatDate(e.completedDate)}
                </td>
                <td>{MyUtil.formatDate(e.deadlineDate!)}</td>
                <td>{e.eventDescription}</td>
                <td className={"text-center"}>
                    {createCompleteButtonForEvent(e)}
                </td>
            </tr>;

        return timelineEvents
            .filter(filterEventNameIsLike)
            .map(mapToRowElement)
    }

    function handleEventTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedEventType(event.target.value)
    }

    //TODO add some nice looking UI changes to the addTimelineEvent action
    // function handleShowFormChange() {
    //     if(showForm)
    // }
    const isBetweenDateInterval = (e: TimelineEventModel): boolean => {
        if(!dateInterval.hasBeenSet) return true
        return (MyUtil.cmp(dateInterval.start, e.deadlineDate) <= 0
            && MyUtil.cmp(dateInterval.end, e.deadlineDate) >= 0)
    }

    function mapToChronoItem(): ChronoItemType[] {

        function filterEventsByTypeAndDate(e: TimelineEventModel) {
            return  isBetweenDateInterval(e) && filterByEventType(e);
        }

        return timelineEvents
            .filter(filterEventsByTypeAndDate)
            .map(event => ({
                title: MyUtil.formatDateWithMonthName(event.deadlineDate!),
                cardTitle: event.eventName,
                cardSubtitle: event.eventDescription === undefined ? "" : event.eventDescription,
                cardDetailedText: event.eventDescription === undefined ? "" : event.eventDescription,
            }))
    }

    function handleEventSubmit(event: TimelineEventModel) {
        props.setNewTimeLineEvent(event)
    }

    type DateInterval = {
        start: string,
        end: string
        hasBeenSet: boolean
    }

    const [dateInterval, setDateInterval] = useState<DateInterval>({start:"", end:"", hasBeenSet: false})

    function onChangeDateInterval(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const key = e.target.name as keyof DateInterval
        setDateInterval(prevState => ({
            ...prevState,
            [key]: e.target.value,
            hasBeenSet: true
        }))
    }

    const handleShowFormChange = () => setShowForm(!showForm)

    return (
        <React.Fragment>
            {hasEvents ?
                showTimeline ?
                    <Row style={{height:"auto", paddingTop: "4rem"}}>
                        <Col>
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
                        </Col>
                        <Col/>
                        <Col>
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
                        </Col>
                        <div style={{ height: "300px" }}>
                            <Button variant={"outline-primary"} onClick={() => setShowTimeline(false)}>Fechar cronologia</Button>
                            <Chrono
                                disableAutoScrollOnClick cardHeight={80} allowDynamicUpdate cardPositionHorizontal={"TOP"}
                                useReadMore
                                items={mapToChronoItem()}
                                mode={"HORIZONTAL"}
                            />
                        </div>
                        </Row>
                    : <div className={"mt-3"}>
                        <Button variant={"primary"} onClick={() => setShowTimeline(true)}>Ver cronologia</Button>
                    </div>

                : <p>Sem eventos para mostrar</p>
            }


            <div className={"float-start mb-5 mt-5"} style={{width: "60%"}}>
                <Button onClick={handleShowFormChange}>{showForm ? "Cancelar" : "Adicionar evento à cronologia"}</Button>


                {showForm && <TimelineEventForm onEventAdded={handleEventSubmit} possibleStates={props.possibleStates}/>}
            </div>
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