import {
    ResearchPatientModel,
    ResearchVisitModel,
    VisitInvestigator
} from "../../../model/research/ResearchModel";
import {TeamInvestigatorModel} from "../../../model/user/TeamInvestigatorModel";
import React, {useEffect, useState} from "react";
import Select, {SingleValue} from "react-select";
import UserModel from "../../../model/user/UserModel";
import {Button, Col, Form, FormGroup, Row} from "react-bootstrap";
import {VisitPeriodicity, VisitTypes} from "../../../common/Constants";
import {FormListVisitInvestigators} from "../common/FormListVisitInvestigators";
import {useParams} from "react-router-dom";
import {MyUtil} from "../../../common/MyUtil";
import {RequiredLabel} from "../../components/RequiredLabel";

type Props = {
    patients: ResearchPatientModel[]
    team: TeamInvestigatorModel[],
    onCancel: () => void,
    onSave: (visit: ResearchVisitModel) => void
}

export function VisitFormComponent(props: Props) {

    const {researchId} = useParams()

    const freshVisit = (): ResearchVisitModel => ({
        id: "",
        researchId: `${researchId}`,
        researchPatientId: "",
        visitType: "",
        scheduledDate: "",
        startDate: "",
        endDate: "",
        periodicity: VisitPeriodicity.NONE.id,
        observations: "",
        researchPatient: {
            patient: {
                gender: "",
                age: "",
                fullName: "",
                processId: ""
            }
        },
        visitInvestigators: []
    })

    const [visit, setVisit] = useState<ResearchVisitModel>(freshVisit())

    const [showPeriodic, setPeriodic] = useState(false)
    const toggleShowPeriodic = () => setPeriodic(prevState => !prevState)


    const onSelectPatient = (data: SingleValue<{value: string, label: string}>) => {
        setSelectedPatient(data)
        const researchPatient = props.patients.find(p => p.id === data!.value)!

        setVisit(prevState => ({
            ...prevState,
            researchPatient: researchPatient,
            researchPatientId: researchPatient.id
        }))
    }

    const [filteredPatients, setFilteredPatients] = useState<{value: string, label: string}[]>([])
    useEffect(() => {
        setFilteredPatients(props.patients.map(p => ({
            label: `${p.patient!.fullName}\n${p.patient!.processId}`,
            value: p.id!
        })))
    }, [props.patients])

    const [selectedPatient, setSelectedPatient] = useState<SingleValue<{value: string, label: string}>>({
        value: "",
        label: ""
    })


    const resetEntry = () => {
        setVisit(freshVisit())
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

    const removeInvestigatorFromVisit = (userId: string) => {

        setVisit(prevState => {
            const team = prevState.visitInvestigators!.filter(vi => vi.investigatorId! !== userId!)
            return {...prevState, visitInvestigators: team}
        })
    }

    const updateVisit = (e: any) => {
        const key = e.target.name as keyof ResearchVisitModel
        const value = e.target.value
        setVisit(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    const handleNewVisit = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        if(visit.researchPatientId === "") {
            alert("Tem de escolher um paciente para associar a esta nova visita.")
            return
        }
        if(visit.visitType === "") {
            alert("Tem de escolher um tipo de visita!")
            return
        }
        if(visit.periodicity !== VisitPeriodicity.NONE.id) {
            if(MyUtil.cmp(visit.endDate, visit.scheduledDate) <= 0) {
                alert("Data inicial só pode ser menor que a data final!")
                return
            }
            visit.startDate = visit.scheduledDate
        }
        if(visit.visitInvestigators!.length === 0) {
            alert("Uma visita tem de ter pelo menos um investigador associado!!")
            return
        }

        props.onSave(visit)
        resetEntry()
    }

    return (
        <Form key={`visit-form`}
              className={"m-2 m-md-2"}
              onSubmit={handleNewVisit}>
            <fieldset className={"border p-3 border-secondary"}>
                <legend className={"float-none w-auto p-2"}>Nova visita</legend>
                <Row className={"mb-3"}>
                    <Col>
                        <div className={"m-2 m-md-2"}>
                            <RequiredLabel label={"Paciente"}/>
                            <Select
                                required
                                placeholder={"-Escolher paciente-"}
                                onChange={onSelectPatient}
                                options={filteredPatients}
                                value={selectedPatient}
                                isSearchable
                                noOptionsMessage={
                                    () => <span>
                                        Não encontras o paciente certo?
                                        Verifica se está associado ao ensaio na aba dos pacientes.
                                    </span>
                                }
                            />
                        {/*  todo maybe add validation feedback here <Link to={`#t=${ResearchTabNames.patients}&s=${TabPaneScope.OVERVIEW}`}/>  */}

                        </div>
                    </Col>
                    <Col>
                        <Form.Group className={"m-2 m-md-2"}>
                            <Form.Label className={"font-bold"}>Nº Processo</Form.Label>
                            <Form.Control
                                disabled
                                required
                                value={visit.researchPatient!.patient!.processId}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={"m-2 m-md-2"}>
                            <Form.Label className={"font-bold"}>Idade</Form.Label>
                            <Form.Control
                                disabled
                                required
                                value={visit.researchPatient!.patient!.age}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={"m-2 m-md-2"}>
                            <Form.Label className={"font-bold"}>Género</Form.Label>
                            <Form.Control
                                disabled
                                required
                                value={visit.researchPatient!.patient!.gender}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className={"mb-3 mt-3"}>
                    <Col>
                        <FormGroup className={"m-2 m-md-2"}>
                            <Form.Label className={"font-bold"}>Tipo de visita <span
                                style={{color: "red"}}>*</span></Form.Label>
                            <Form.Select
                                required
                                key={"visit-type-selection"}
                                aria-label="state selection"
                                name={"visitType"}
                                isInvalid={visit.visitType === ""}
                                defaultValue={"-1"}
                                onChange={updateVisit}
                            >
                                <option value={"-1"} disabled>-Tipo de visita-</option>
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
                        {showPeriodic &&
                            <FormGroup className={"m- 2 m-md-2"}>
                                <Form.Label className={"font-bold"}>Tipo de periodicidade <span
                                    style={{color: "red"}}>*</span></Form.Label>
                                {/* Todo eventually add validation based on endDate, if diff(start, end) > 7, week and month should be not be possible to choose */}
                                <Form.Select
                                    key={"visit-periodic-selection"}
                                    aria-label="visit periodicity selection"
                                    required={showPeriodic}
                                    isInvalid={visit.periodicity === ""}
                                    name={"periodicity"}
                                    defaultValue={"-1"}
                                    onChange={updateVisit}
                                >
                                    <option value={"-1"} disabled>-Periodicidade-</option>
                                    {
                                        Object.values(VisitPeriodicity).map(vp =>
                                            <option key={vp.id} value={vp.id}>{vp.name}</option>
                                        )
                                    }
                                </Form.Select>
                                <br/>
                                {visit.periodicity === "CUSTOM" &&
                                    <div>
                                        <span>Re-agendar a cada <span
                                            style={{color: "red"}}>*</span></span>
                                        <input className={"ms-2 me-2 ms-md-2 me-md-2"}
                                               type={"number"}
                                               name={"customPeriodicity"}
                                               required={showPeriodic && visit.periodicity === "CUSTOM"}
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
                            possibleInvestigators={props.team}
                            />
                    </Col>
                    <Col>
                        <FormGroup className={"m-2"}>
                            <Form.Label
                                className={"font-bold"}>{showPeriodic ? "Dia da primeira visita" : "Data e hora"} <span
                                style={{color: "red"}}>*</span></Form.Label>
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
                                <Form.Label className={"font-bold"}>
                                    Dia da última visita <span style={{color: "red"}}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type={"datetime-local"}
                                    required={showPeriodic}
                                    name={"endDate"}
                                    value={visit.endDate}
                                    onChange={updateVisit}
                                />
                            </FormGroup>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button className={"float-start"} variant={"outline-danger"}
                                style={{width:"100%"}}
                                onClick={props.onCancel}>Cancelar</Button>
                    </Col>
                    <Col/>
                    <Col>
                        <Button className={"float-end"} variant={"outline-primary"}
                                style={{width:"100%"}}
                                type={"submit"}>Agendar</Button>
                    </Col>
                </Row>
            </fieldset>

        </Form>)
}