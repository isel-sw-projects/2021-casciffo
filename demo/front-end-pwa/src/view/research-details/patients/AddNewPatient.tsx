import {
    PatientModel,
    PatientVisitsAggregate,
    ResearchVisitModel,
    VisitInvestigator
} from "../../../model/research/ResearchModel";
import {
    Accordion,
    Breadcrumb,
    Button,
    Col,
    Container,
    Dropdown,
    Form,
    FormGroup,
    ListGroup,
    Row
} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import "../../../assets/css/accordion-collapse.css";
import {TeamInvestigatorModel} from "../../../model/TeamInvestigatorModel";
import UserModel from "../../../model/user/UserModel";
import {VisitTypes} from "../../../common/Constants";
import {AsyncAutoCompletePatientSearch} from "./AsyncAutoCompletePatientSearch";

type Props = {
    team: TeamInvestigatorModel[]
    searchByProcessId: (pId: string) => Promise<PatientModel[]>
    onRenderOverviewClick: () => void
}

export function AddNewPatient(props: Props) {
    const freshPatient =
        (): PatientVisitsAggregate => ({patient:{fullName: "", processId: "", age: "", gender: "", treatmentBranch: ""}, scheduledVisits: [{},{},{},{},{}]})

    const [patientToAdd, setPatientToAdd] = useState<PatientVisitsAggregate>(freshPatient())

    const updateUserToAdd = (e: any) => setPatientToAdd(prevState => ({...prevState, patient:{...prevState.patient, [e.target.name]: e.target.value}}))

    const onSaveVisit = (visit: ResearchVisitModel, idx: number) => {
        const newVisits = patientToAdd.scheduledVisits
        newVisits[idx] = visit
        setPatientToAdd(prevState => ({
            ...prevState,
            scheduledVisits: newVisits
        }))
    }

    const submitPatientData = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
    }

    const onSelectPatient = useCallback((patientSelected: PatientModel) => {
        setPatientToAdd(prevState => ({...prevState, patient: patientSelected}))
    }, [])

    return <Container className={"border-top border-2 border-secondary"}>

        <Breadcrumb className={"m-2 m-md-2 flex"}>
            <Breadcrumb.Item className={"font-bold"} onClick={props.onRenderOverviewClick}>Pacientes</Breadcrumb.Item>
            <Breadcrumb.Item className={"font-bold"} active>Adicionar paciente</Breadcrumb.Item>
        </Breadcrumb>

        <Form className={"m-2 m-md-2"} onSubmit={submitPatientData}>
            <fieldset className={"border border-secondary p-3"} style={{width:"40%"}}>
                <legend className={"float-none w-auto p-2"}>Dados do paciente</legend>
                <AsyncAutoCompletePatientSearch requestPatients={props.searchByProcessId} setPatient={onSelectPatient}/>

                <Form.FloatingLabel className={"m-2 m-md-2 font-bold"}
                                    label={<span>Nº Processo <span style={{color: "red"}}>*</span></span>}>
                    <Form.Control
                        required
                        type={"number"}
                        name={"processId"}
                        placeholder={"Nº Processo"}
                        value={patientToAdd.patient.processId}
                        onChange={updateUserToAdd}
                    />
                </Form.FloatingLabel>

                <Form.FloatingLabel className={"m-2 m-md-2 font-bold"}
                                    label={<span>Nome completo <span style={{color: "red"}}>*</span></span>}>
                    <Form.Control
                        required
                        type={"text"}
                        name={"fullName"}
                        placeholder={"Nome"}
                        value={patientToAdd.patient.fullName}
                        onChange={updateUserToAdd}
                    />
                </Form.FloatingLabel>

                <Form.FloatingLabel className={"m-2 m-md-2 font-bold"}
                                    label={<span>Género <span style={{color: "red"}}>*</span></span>}>
                    <Form.Control
                        required
                        type={"text"}
                        name={"gender"}
                        placeholder={"Género"}
                        value={patientToAdd.patient.gender}
                        onChange={updateUserToAdd}
                    />
                </Form.FloatingLabel>

                <Form.FloatingLabel className={"m-2 m-md-2 font-bold"}
                                    label={<span>Idade <span style={{color: "red"}}>*</span></span>}>
                    <Form.Control
                        required
                        type={"number"}
                        name={"idade"}
                        placeholder={"Idade"}
                        value={patientToAdd.patient.age}
                        onChange={updateUserToAdd}
                    />
                </Form.FloatingLabel>

                <Form.FloatingLabel className={"m-2 m-md-2 font-bold"} label={<span>Braço de tratamento</span>}>
                    <Form.Control
                        type={"text"}
                        name={"treatmentBranch"}
                        placeholder={"Braço de tratamento"}
                        value={patientToAdd.patient.treatmentBranch}
                        onChange={updateUserToAdd}
                    />
                </Form.FloatingLabel>
            </fieldset>
        </Form>


        <Container className={"mt-5 mb-5"}>
            <h5>Agendar visitas (até 5)</h5>

            <Accordion className={"mt-4 mb-2"} defaultActiveKey={['0']} alwaysOpen>
            {[1, 2, 3, 4, 5].map((n,i) =>
                <VisitAccordion
                    key={i}
                    onSave={onSaveVisit}
                    title={`Visita ${n}`}
                    idx={i}
                    team={props.team}
                />
            )}
            </Accordion>

            <div className={"mt-4 mb-3 text-center flex"}>
                <Button style={{width:"50%"}} variant={"outline-primary"} onClick={submitPatientData}>Concluir</Button>
            </div>
        </Container>

    </Container>

}

type VisitAccordionProps = {
    onSave: (visit: ResearchVisitModel, idx: number) => void,
    title: string,
    idx: number,
    team: TeamInvestigatorModel[]
}

function VisitAccordion(props: VisitAccordionProps) {

    const [visit, setVisit] = useState<ResearchVisitModel>({
        visitType: "",
        scheduledDate: "",
        startDate: "",
        endDate: "",
        periodicity: "",
        visitInvestigators: []
    })

    const updateVisit = (e: any) => {
        setVisit(prevState => ({...prevState, [e.target.name]: e.target.value}))
    }

    const [showPeriodic, setPeriodic] = useState(false)
    const toggleShowPeriodic = () => setPeriodic(prevState => !prevState)

    const filterInvestigatorsNotChosen = (investigator: TeamInvestigatorModel) => {
        return visit.visitInvestigators!.every(vi => vi.investigatorId !== investigator.memberId)
    }

    const addInvestigatorToVisit = (newInvestigator: UserModel) => {
        const ni: VisitInvestigator = {
            investigator: newInvestigator,
            investigatorId: newInvestigator.userId

        }
        setVisit(prevState => {
            const team = [ni, ...prevState.visitInvestigators ?? []]

            return {...prevState, visitInvestigators: team}
        })
    }

    const [dataSaved, setDataSaved] = useState(false)
    const [isSavingData, setIsSavingData] = useState(false)

    const handleSaveVisit = (e: any) => {
        e.preventDefault()
        e.stopPropagation()

        if(visit.visitInvestigators?.length === 0) {
            alert("Uma visita tem obrigatóriamente de ter pelo menos um investigador associado.")
            return
        }

        setDataSaved(true)
        setIsSavingData(true)
        setInterval(() => {
            setIsSavingData(false)
        }, 3000)
        const visitToSave = visit

        if (showPeriodic) visitToSave.startDate = visitToSave.scheduledDate
        props.onSave(visit, props.idx)
    }


    return (
        <Accordion.Item eventKey={`${props.idx}`} key={`accordion-visita-${props.idx}`}>
            <Accordion.Header style={{backgroundColor: dataSaved ? "lime" : "inherit"}}>
                <b>{`${props.title}${(dataSaved && " - Dados guardados") || ""}`}</b>
            </Accordion.Header>
            <Accordion.Body className={"p-2"}>
                <Form key={`visit-form-${props.title}`} className={"m-2 m-md-2"} onSubmit={handleSaveVisit}>
                    <Row>
                        <Col>
                            <FormGroup className={"m-2 m-md-2"}>
                                <Form.Label className={"font-bold"}>Tipo de visita <span style={{color: "red"}}>*</span></Form.Label>
                                <Form.Select
                                    key={"visit-type-selection"}
                                    required
                                    aria-label="state selection"
                                    name={"visitType"}
                                    defaultValue={"Screening"}
                                    onChange={updateVisit}
                                >
                                    {Object.values(VisitTypes).map(vt =>
                                        <option key={vt.id} value={vt.id}>{vt.name}</option>
                                    )}
                                </Form.Select>
                            </FormGroup>

                            <FormGroup className={"flex-column m-2 m-md-2"}>
                                <Form.Label className={"font-bold"}>Visita Periódica</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="visit-periodic-switch"
                                    checked={showPeriodic}
                                    onChange={toggleShowPeriodic}
                                />
                            </FormGroup>
                            { showPeriodic &&
                                //todo CHECK THIS
                                <FormGroup className={"m- 2 m-md-2"}>
                                    <Form.Label className={"font-bold"}>Tipo de periodicidade</Form.Label>
                                    <Form.Select
                                        key={"visit-periodic-selection"}
                                        aria-label="visit periodicity selection"
                                        name={"periodicity"}
                                        defaultValue={"Daily"}
                                        onChange={updateVisit}
                                    >
                                        <option value={"DAILY"}>Diária</option>
                                        <option value={"WEEKLY"}>Semanal</option>
                                        <option value={"MONTHLY"}>Mensal</option>
                                        <option value={"CUSTOM"}>Outro</option>
                                    </Form.Select>
                                    {visit.periodicity === "CUSTOM" &&
                                        <span>Re-agendar a cada <input type={"number"}/> dias.</span>
                                    }
                                </FormGroup>
                            }
                        </Col>
                        <Col>
                            <Dropdown style={{width:"100%"}}>
                                <Dropdown.Toggle className={"mb-2"} split variant={"outline-primary"} style={{width:"100%"}}>
                                    Adicionar Investigador  
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{width:"100%"}}>
                                    {props.team?.length !== visit.visitInvestigators!.length ?
                                        props.team
                                            ?.filter(filterInvestigatorsNotChosen)
                                            ?.map((t,i) =>
                                            <Dropdown.Item key={i} onClick={() => addInvestigatorToVisit(t.member!)}>
                                                {t.member!.name}
                                                <br/>
                                                <small>
                                                    {t.member!.email}
                                                </small>
                                            </Dropdown.Item>)
                                        : <Dropdown.Item key={"empty menu"}>
                                            <span className={"text-danger"}>Não existem mais investigadores!</span>
                                        </Dropdown.Item>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>

                            <ListGroup>
                                <ListGroup.Item className={"border-bottom border-secondary text-center"}>Investigadores associados à visita <span style={{color: "red"}}>*</span></ListGroup.Item>

                                {visit.visitInvestigators!
                                    .map((inv, idx) =>
                                <ListGroup.Item key={inv.investigatorId} className={"flex-column"} variant={(idx & 1) === 1 ? "dark" : "light"}>
                                    {inv.investigator!.name}
                                    <br/>
                                    <small>
                                        {inv.investigator!.email}
                                    </small>
                                </ListGroup.Item>)}
                            </ListGroup>
                        </Col>
                        <Col>
                            <FormGroup className={"m-2"}>
                                <Form.Label className={"font-bold"}>{showPeriodic ? "Dia da primeira visita" : "Data e hora" }<span style={{color: "red"}}>*</span></Form.Label>
                                <Form.Control
                                    type={"datetime-local"}
                                    required
                                    name={"scheduledDate"}
                                    value={visit.scheduledDate}
                                    onChange={updateVisit}
                                />
                            </FormGroup>

                            {showPeriodic &&
                                <FormGroup className={"m-2"}>
                                    <Form.Label className={"font-bold"}>Dia da última visita <span style={{color: "red"}}>*</span></Form.Label>
                                    <Form.Control
                                        type={"datetime-local"}
                                        required
                                        name={"endDate"}
                                        value={visit.endDate}
                                        onChange={updateVisit}
                                    />
                                </FormGroup>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col/>
                        <Col/>
                        <Col>
                            <Button className={"float-end"} variant={ isSavingData ? "success" : "outline-primary"} type={"submit"}>{isSavingData ? "Dados guardados!" : "Guardar dados"}</Button>
                        </Col>
                    </Row>

                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
    //<MyAccordion title={props.title}>
    // </MyAccordion>
}

// <Stack direction={"horizontal"}>
//     <div className={"flex bi-plus-lg"} style={{width:"5%"}}/>
//     <div className={"flex text-center font-bold"} style={{width:"60%"}}>
//         Adicionar investigador
//     </div>
// </Stack>