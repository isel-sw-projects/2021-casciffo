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
    Form,
    FormGroup,
    Row
} from "react-bootstrap";
import React, {useCallback, useState} from "react";
import "../../../assets/css/accordion-collapse.css";
import {TeamInvestigatorModel} from "../../../model/user/TeamInvestigatorModel";
import UserModel from "../../../model/user/UserModel";
import {VisitPeriodicity, VisitTypes} from "../../../common/Constants";
import {AsyncAutoCompletePatientSearch} from "./AsyncAutoCompletePatientSearch";
import {FormListVisitInvestigators} from "../common/FormListVisitInvestigators";
import {FloatingLabelHelper} from "../../components/FloatingLabelHelper";

type Props = {
    team: TeamInvestigatorModel[]
    searchByProcessId: (pId: string) => Promise<PatientModel[]>
    onRenderOverviewClick: () => void
    onSavePatientAndVisits: (patientVisitAggregate: PatientVisitsAggregate) => void
}

export function AddNewPatient(props: Props) {
    const freshPatient =
        (): PatientVisitsAggregate => ({patient:{fullName: "", processId: "", age: "", gender: "", id: ""}, scheduledVisits: [{},{},{},{},{}]})

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

        const form = {
            patient: patientToAdd.patient,
            scheduledVisits: patientToAdd.scheduledVisits.filter(v => v.scheduledDate != null)
        }
        props.onSavePatientAndVisits(form)
        props.onRenderOverviewClick()
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
                <div className={"m-2 m-md-2"}>
                    <AsyncAutoCompletePatientSearch requestPatients={props.searchByProcessId} setPatient={onSelectPatient}/>
                </div>

                <FloatingLabelHelper
                    required
                    label={"Nº Processo"}
                    name={"processId"}
                    type={"number"}
                    value={patientToAdd.patient.processId}
                />
                <FloatingLabelHelper
                    required
                    label={"Nome completo"}
                    name={"fullName"}
                    value={patientToAdd.patient.fullName}
                />
                <FloatingLabelHelper
                    required
                    label={"Género"}
                    name={"gender"}
                    value={patientToAdd.patient.gender}
                />
                <FloatingLabelHelper
                    required
                    label={"Idade"}
                    name={"age"}
                    type={"number"}
                    value={patientToAdd.patient.age}
                />
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
        visitType: VisitTypes.FIRST_VISIT.id,
        researchId: "",
        scheduledDate: "",
        startDate: "",
        endDate: "",
        periodicity: VisitPeriodicity.NONE.id,
        customPeriodicity: 1,
        visitInvestigators: []
    })

    const updateVisit = (e: any) => {
        setVisit(prevState => ({...prevState, [e.target.name]: e.target.value}))
    }

    const [showPeriodic, setPeriodic] = useState(false)
    const toggleShowPeriodic = () => setPeriodic(prevState => !prevState)


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

    const removeInvestigatorFromVisit = (userId: string) => {

        setVisit(prevState => {
            const team = prevState.visitInvestigators!.filter(vi => vi.investigatorId! !== userId!)
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
        if(visit.periodicity === VisitPeriodicity.CUSTOM.id && visit.customPeriodicity! <= 0) {
            alert("Tem de inserir uma periodicidade maior que zero!")
            return
        }
        if(visit.visitInvestigators!.length === 0) {
            alert("Uma visita tem de ter pelo menos um investigador associado!!")
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
                <Form key={`visit-form-${props.title}`}
                      className={"m-2 m-md-2"}
                      onSubmit={handleSaveVisit}>
                    <Row>
                        <Col>
                            <FormGroup className={"m-2 m-md-2"}>
                                <Form.Label className={"font-bold"}>Tipo de visita <span style={{color: "red"}}>*</span></Form.Label>
                                <Form.Select
                                    key={"visit-type-selection"}
                                    required
                                    aria-label="state selection"
                                    name={"visitType"}
                                    defaultValue={VisitTypes.FIRST_VISIT.id}
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
                                <FormGroup className={"m- 2 m-md-2"}>
                                    <Form.Label className={"font-bold"}>Tipo de periodicidade</Form.Label>
                                    <Form.Select
                                        key={"visit-periodic-selection"}
                                        aria-label="visit periodicity selection"
                                        name={"periodicity"}
                                        defaultValue={VisitPeriodicity.NONE.id}
                                        onChange={updateVisit}
                                    >
                                        {
                                            Object.values(VisitPeriodicity).map(vp =>
                                                <option key={vp.id} value={vp.id}>{vp.name}</option>
                                            )
                                        }
                                    </Form.Select>
                                    <br/>
                                    {visit.periodicity === "CUSTOM" &&
                                        <div>
                                            <span>Re-agendar a cada</span>
                                            <input className={"ms-2 me-2 ms-md-2 me-md-2"}
                                                   type={"number"}
                                                   name={"customPeriodicity"}
                                                   value={visit.customPeriodicity}
                                                   onChange={updateVisit}
                                            />
                                           <span> dias. </span>
                                        </div>
                                    }
                                </FormGroup>
                            }
                        </Col>
                        <Col>
                            <FormListVisitInvestigators
                                visitInvestigators={visit.visitInvestigators!}
                                addInvestigatorToVisit={addInvestigatorToVisit}
                                removeInvestigatorFromVisit={removeInvestigatorFromVisit}
                                possibleInvestigators={props.team}/>
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