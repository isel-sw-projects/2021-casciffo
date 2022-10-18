import React, {useCallback, useEffect, useState} from "react";
import {ResearchAggregateService} from "../../../services/ResearchAggregateService";
import {useLocation, useParams} from "react-router-dom";
import {useErrorHandler} from "react-error-boundary";
import {MyError} from "../../error-view/MyError";
import {PatientModel, ResearchVisitModel, VisitInvestigator} from "../../../model/research/ResearchModel";
import {
    Breadcrumb,
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    FormLabel,
    FormSelect, FormText,
    ListGroup,
    Row,
    Stack
} from "react-bootstrap";
import {MyUtil} from "../../../common/MyUtil";
import {PeriodicityTypes, VisitTypes} from "../../../common/Constants";
import {BiCheckCircle} from "react-icons/bi";
import {FormInputHelper} from "../research/FormInputHelper";
import {CgDanger} from "react-icons/cg";



type VisitDetailsProps = {
    service: ResearchAggregateService
    onRenderOverviewClick: () => void
}

function MyDateComponent(props: { date: string, title: string }) {
    return <>
        <FormGroup className={"text-center flex-column mb-2"}>
            <FormLabel> <span className={"font-bold"}>{props.title}</span></FormLabel>
            <div className={"text-center flex"}>
                <input className={"text-center me-1 ms-1"} style={{width: "10%"}} disabled type={"text"}
                       value={MyUtil.getDay(props.date)}/>
                /
                <input className={"text-center me-1 ms-1"} style={{width: "10%"}} disabled type={"text"}
                       value={MyUtil.getMonth(props.date)}/>
                /
                <input className={"text-center me-1 ms-1"} style={{width: "15%"}} disabled type={"text"}
                       value={MyUtil.getYear(props.date)}/>
            </div>
        </FormGroup>
        <FormGroup className={"text-center flex-column mt-1"}>
            <FormLabel className={"font-bold"}>Horas</FormLabel>
            <input className={"text-center me-1 ms-1"} style={{width: "15%"}} disabled type={"text"}
                   value={MyUtil.getHour(props.date) + " h"}/>
            :
            <input className={"text-center me-1 ms-1"} style={{width: "15%"}} disabled type={"text"}
                   value={MyUtil.getMinutes(props.date) + " m"}/>
        </FormGroup>
    </>;
}

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
        participantId: "",
        visitType: "",
        scheduledDate: "",
        startDate: "",
        endDate: "",
        periodicity: "",
        observations: "",
        hasAdverseEventAlert: false,
        hasMarkedAttendance: false,
        patient: {},
        visitInvestigators: [],
    })


    useEffect(() => {
        const regExp = new RegExp(/(vId=[0-9]*)/, "gm")
        if (!regExp.test(hash)) {
            errorHandler(new MyError("Página da visita não existe", 404))
        }
        try {
            const params = hash.substring(1).split("&")
            const vId = params.find(p => p.matchAll(regExp))!.split("=")[1]
            setVisitId(vId)

            props.service
                .getVisitDetails(researchId!, vId)
                // .then(value => {
                //     console.log(value); return value
                // })
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

    const concluded = visit.concluded

    const updateVisit = (e: any) => setVisit(prevState => ({...prevState, [e.target.name]: e.target.value}))
    const toggleAdverseEvent = () => setVisit(prevState => ({...prevState, hasAdverseEventAlert: !prevState.hasAdverseEventAlert}))

    return <React.Fragment>
        <Container className={"border-top border-2 border-secondary mb-2"}>
            <Breadcrumb className={"m-2 m-md-2 flex"}>
                <Breadcrumb.Item className={"font-bold"} onClick={props.onRenderOverviewClick}>Visitas</Breadcrumb.Item>
                <Breadcrumb.Item className={"font-bold"} active>Detalhes da visita {visitId}</Breadcrumb.Item>
            </Breadcrumb>
        </Container>

        {dataReady &&
            <Container className={"m-2 m-md-2 p-2 p-md-2"}>
                <Form className={"border-bottom border-2 border-secondary mb-2"}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <FormLabel className={"font-bold"}>Periodicidade</FormLabel>
                                <FormSelect value={0} disabled>
                                    {/*TODO SE FOR CUSTOM ENTAO MOSTRAR ESSA CONFIGURAÇÃO*/}
                                    <option
                                        value={0}>{Object.values(PeriodicityTypes).find(p => p.id === visit.periodicity)!.name}</option>
                                </FormSelect>
                            </FormGroup>
                        </Col>
                        <Col>
                            <MyDateComponent date={visit.scheduledDate!} title={"Dia agendado"}/>
                        </Col>
                        <Col>
                            {visit.periodicity !== PeriodicityTypes.NONE.id &&
                                <>
                                    <MyDateComponent date={visit.startDate!} title={"Data da primeira visita"}/>
                                    <MyDateComponent date={visit.endDate!} title={"Data da última visita periódica"}/>
                                </>
                            }
                        </Col>
                    </Row>
                    <Row className={"mt-3 mb-3"}>
                        <Col>
                            <fieldset className={"border border-2 p-3"}>
                                <legend className={"float-none w-auto p-2"}>Dados do paciente</legend>
                                <FormInputHelper inline label={"Nome"} value={visit.patient!.fullName}/>
                                <FormInputHelper inline label={"Idade"} value={visit.patient!.age}/>
                                <FormInputHelper inline label={"Género"} value={visit.patient!.gender}/>
                                <FormInputHelper inline label={"Braço de tratamento"} value={visit.patient!.treatmentBranch}/>
                                <Button variant={"link"}>Processo Nº {visit.patient!.processId}</Button>
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
                                        : <Button variant={"link"} onClick={toggleAttendance} disabled={!concluded}>Marcar presença</Button>
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

                            <Button variant={"link  float-end"} onClick={toggleAdverseEvent} disabled={concluded}>
                                { visit.hasAdverseEventAlert
                                    ? <h5 className={"font-bold"}>Existência de evento adverso marcado!</h5>
                                    : <h5 className={"font-bold"}><CgDanger size={100}/> Marcar evento adverso</h5>
                                }
                            </Button>
                                {!concluded && visit.hasAdverseEventAlert && <small>Podes clicar de novo para desmarcar a existência de evento(s) adverso(s)</small>}
                                {concluded && <small className={"text-danger"}>Esta visita já não pode ser alterada</small>}
                        </Col>
                    </Row>

                    <Form.Control as={"textarea"} name={"observations"} value={visit.observations} disabled={concluded} onChange={updateVisit}/>

                <br/>
                <Container style={{width: "100%"}} className={"text-center"}>
                    <Button style={{width:"60%"}} className={"mt-2"} variant={concluded ? "success" : "outline-success"}
                            onClick={saveVisit} disabled={concluded}
                    >{concluded ? "Concluir visita" : "Visita concluída"}</Button>
                </Container>
                </Container>
            </Container>
        }
    </React.Fragment>
}