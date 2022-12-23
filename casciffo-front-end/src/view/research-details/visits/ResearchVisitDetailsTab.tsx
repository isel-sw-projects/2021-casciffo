import React, {useCallback, useEffect, useState} from "react";
import {ResearchAggregateService} from "../../../services/ResearchAggregateService";
import {useLocation, useParams} from "react-router-dom";
import {useErrorHandler} from "react-error-boundary";
import {MyError} from "../../error-view/MyError";
import {ResearchVisitModel} from "../../../model/research/ResearchModel";
import {
    Breadcrumb,
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    FormLabel,
    FormSelect,
    ListGroup,
    Row
} from "react-bootstrap";
import {MyUtil} from "../../../common/MyUtil";
import {VisitPeriodicity, VISIT_ID_PARAMETER, VisitTypes} from "../../../common/Constants";
import {BiCheckCircle} from "react-icons/bi";
import {FormInputHelper} from "../../components/FormInputHelper";
import {CgDanger} from "react-icons/cg";



type VisitDetailsProps = {
    service: ResearchAggregateService
    onRenderOverviewClick: () => void
    onRenderPatientDetails: (s: string) => void
}

function MyDateComponent(props: { date: string, title: string }) {
    return <>
        <FormGroup className={"text-center flex-column mb-2"}>
            <FormLabel> <span className={"font-bold"}>{props.title}</span></FormLabel>
            <div className={"text-center flex"}>
                <input className={"text-center me-1 ms-1"} style={{width: "10%"}} disabled type={"text"}
                       value={MyUtil.getDateTimeField(props.date, "day")}/>
                /
                <input className={"text-center me-1 ms-1"} style={{width: "10%"}} disabled type={"text"}
                       value={MyUtil.getDateTimeField(props.date, "month")}/>
                /
                <input className={"text-center me-1 ms-1"} style={{width: "15%"}} disabled type={"text"}
                       value={MyUtil.getDateTimeField(props.date, "year")}/>
            </div>
        </FormGroup>
        <FormGroup className={"text-center flex-column mt-1"}>
            <FormLabel className={"font-bold"}>Horas</FormLabel>
            <input className={"text-center me-1 ms-1"} style={{width: "15%"}} disabled type={"text"}
                   value={MyUtil.getDateTimeField(props.date, "hour") + " h"}/>
            :
            <input className={"text-center me-1 ms-1"} style={{width: "15%"}} disabled type={"text"}
                   value={MyUtil.getDateTimeField(props.date, "minute") + " m"}/>
        </FormGroup>
    </>;
}

//TODO ADD RESTRICTION TO WHO CAN MANIPULATE THE VISIT AND ONLY ALLOW EDIT ON THE DAY OF VISIT
export function ResearchVisitDetailsTab(props: VisitDetailsProps) {

    const {hash} = useLocation()
    const {researchId} = useParams()
    const [visitId, setVisitId] = useState("")
    const errorHandler = useErrorHandler()
    const [dataReady, setDataReady] = useState(false)

    useEffect(() => {
        document.title = MyUtil.RESEARCH_VISIT_DETAIL_TITLE(researchId!, visitId)
    }, [researchId, visitId])

    const [visit, setVisit] = useState<ResearchVisitModel>({
        id: "",
        researchId: researchId,
        researchPatientId: "",
        visitType: "",
        scheduledDate: "",
        startDate: "",
        endDate: "",
        periodicity: "",
        observations: "",
        hasAdverseEventAlert: false,
        hasMarkedAttendance: false,
        researchPatient: {},
        visitInvestigators: [],
        concluded: false
    })


    useEffect(() => {

        try {
            const params = MyUtil.parseUrlHash(hash).find(params => params.key === VISIT_ID_PARAMETER)
            if (!params) {
                errorHandler(new MyError("Página da visita não existe", 404))
            }
            const vId = params!.value
            setVisitId(vId)

            props.service
                .getVisitDetails(researchId!, vId)
                .then(setVisit)
                .then(_ => setDataReady(true))
                .catch(errorHandler)
        } catch (e: unknown) {
            errorHandler(e)
        }
    }, [errorHandler, hash, props.service, researchId])

    const toggleAttendance = () => setVisit(prevState => ({...prevState, hasMarkedAttendance: true}))

    const saveVisit = useCallback(() => {
        props.service
            .concludeVisit(researchId!, visitId, visit)
            .then(setVisit)
            .catch(errorHandler)
    }, [props.service, researchId, visitId, visit, errorHandler])

    const updateVisit = (e: any) => setVisit(prevState => ({...prevState, [e.target.name]: e.target.value}))
    const setAdverseEvent = () => setVisit(prevState => ({...prevState, hasAdverseEventAlert: !prevState.hasAdverseEventAlert}))


    const changeParamsAndRenderPatientDetails = () => {
        props.onRenderPatientDetails(visit.researchPatient!.patient!.processId!)
    }

    return <React.Fragment>
        <Container className={"border-top border-2 border-secondary mb-2"}>
            <Breadcrumb className={"m-2 m-md-2 flex"}>
                <Breadcrumb.Item className={"font-bold"} onClick={props.onRenderOverviewClick}>Visitas</Breadcrumb.Item>
                <Breadcrumb.Item className={"font-bold"} active>Detalhes da visita {visitId}</Breadcrumb.Item>
            </Breadcrumb>
            {visit.concluded && <small className={"text-danger"}>Esta visita já não pode ser alterada</small>}
        </Container>

        {dataReady &&
            <Container className={"m-2 m-md-2 p-2 p-md-2"}>
                <Form className={"border-bottom border-2 border-secondary mb-2"}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className={"font-bold"}>Periodicidade</Form.Label>
                                <Form.Select value={0} disabled>
                                    <option value={0}>
                                        {visit.customPeriodicity != null ?
                                            `Agendado a cada ${visit.customPeriodicity > 1 ? "dias" : "dia"}.`
                                            :
                                            Object.values(VisitPeriodicity).find(p => p.id === visit.periodicity)!.name}
                                    </option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                           <MyDateComponent date={visit.scheduledDate!} title={"Dia Agendado"}/>
                        </Col>
                        <Col/>
                    </Row>
                    <Row className={"mt-3 mb-3"}>
                        <Col>
                            <fieldset className={"border border-2 p-3"}>
                                <legend className={"float-none w-auto p-2"}>Dados do paciente</legend>
                                <FormInputHelper inline label={"Nome"} value={visit.researchPatient!.patient!.fullName}/>
                                <FormInputHelper inline label={"Idade"} value={visit.researchPatient!.patient!.age}/>
                                <FormInputHelper inline label={"Género"} value={visit.researchPatient!.patient!.gender}/>
                                <FormInputHelper inline label={"Braço de tratamento"} value={visit.researchPatient!.treatmentBranch}/>
                                <Button variant={"link"} onClick={changeParamsAndRenderPatientDetails}>
                                    Processo Nº {visit.researchPatient!.patient!.processId}
                                </Button>
                            </fieldset>
                        </Col>
                        <Col>
                            <ListGroup className={"mt-4"}>
                                <ListGroup.Item className={"border-bottom border-secondary text-center"} variant={"info"}>Investigadores associados à visita</ListGroup.Item>

                                {visit.visitInvestigators!
                                    .map((inv, idx) =>
                                        <ListGroup.Item key={inv.investigatorId} className={"flex-column"} variant={(idx & 1) === 1 ? "secondary" : "light"}>
                                            {inv.investigator!.name}
                                            <br/>
                                            <small>
                                                {inv.investigator!.email}
                                            </small>
                                        </ListGroup.Item>)}
                            </ListGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <span className={"font-bold"}>Tipo de visita</span>
                                <FormSelect disabled value={0}>
                                    <option value={0}>{Object.values(VisitTypes).find(vt => vt.id === visit.visitType)!.name}</option>
                                </FormSelect>
                            </FormGroup>
                            <br/>
                            <FormGroup>
                                {
                                    visit.hasMarkedAttendance
                                        ? <><span style={{color: "#1dd609"}}>Presença marcada</span> <BiCheckCircle/></>
                                        : <Button variant={"link"} onClick={toggleAttendance} disabled={visit.concluded}>Marcar presença</Button>
                                }
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
                <Container className={"mt-2 mb-4"}>
                    <Row>
                        <Col>
                            <h5 className={"font-bold"}>Observações</h5>
                        </Col>
                        <Col>

                            <Button variant={"link  float-end"} onClick={setAdverseEvent} disabled={visit.concluded}>
                                { visit.hasAdverseEventAlert
                                    ? <h5 className={"font-bold text-danger"}>Existência de evento adverso marcado!</h5>
                                    : <h5 className={"font-bold"}><CgDanger size={100}/> Marcar evento adverso</h5>
                                }
                            </Button>
                        </Col>
                    </Row>

                    <Form.Control as={"textarea"} name={"observations"} value={visit.observations} disabled={visit.concluded} onChange={updateVisit}/>

                <br/>
                <Container style={{width: "100%"}} className={"text-center"}>
                    <Button style={{width:"60%"}} className={"mt-2"} variant={visit.concluded ? "success" : "outline-success"}
                            onClick={saveVisit} disabled={visit.concluded}
                    >{visit.concluded ? "Visita concluída" : "Concluir visita"}</Button>
                </Container>
                </Container>
            </Container>
        }
    </React.Fragment>
}