import React, {FormEvent, useCallback, useEffect, useState} from "react";
import {MyUtil} from "../../../common/MyUtil";
import {
    PatientModel,
    ResearchPatientModel,
    ResearchVisitModel,
    VisitInvestigator
} from "../../../model/research/ResearchModel";
import {VisitChrono, VisitPeriodicity, VisitTypes} from "../../../common/Constants";
import {ColumnDef} from "@tanstack/react-table";
import {useParams} from "react-router-dom";
import {Button, Col, Container, Dropdown, Form, FormGroup, ListGroup, Row, Stack} from "react-bootstrap";
import {SearchComponent} from "../../components/SearchComponent";
import {MyTable} from "../../components/MyTable";
import {TeamInvestigatorModel} from "../../../model/TeamInvestigatorModel";
import UserModel from "../../../model/user/UserModel";
import Select, {SingleValue} from "react-select";

type VisitProps = {
    visits: ResearchVisitModel[]
    onAddVisit: (visit: ResearchVisitModel) => void
    renderDetails: (vId: string) => void
    patients: ResearchPatientModel[]
    researchTeam: TeamInvestigatorModel[]
}

export function ResearchVisitsTab(props: VisitProps) {
    const {researchId} = useParams()

    useEffect(() => {
       document.title = MyUtil.RESEARCH_VISITS_TITLE(researchId!)
    }, [researchId])


    const [visits, setVisits] = useState<ResearchVisitModel[]>([])
    const [query, setQuery] = useState("")
    const [searchProperty, setSearchProperty] = useState<string>("id")
    const [showVisitHistory, setShowVisitHistory] = useState<string>("ALL")


    useEffect(() => {
        setVisits(props.visits)
    }, [props.visits])


    const handleVisitChronoChange = (event: React.ChangeEvent<HTMLSelectElement>) => setShowVisitHistory(event.target.value)



    // function getHeaders() : CSVHeader[] {
    //     return researchType === ResearchTypes.CLINICAL_TRIAL.id? tableHeadersClinicalTrials : tableHeadersClinicalStudies
    // }



    const columns = React.useMemo<ColumnDef<ResearchVisitModel>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                cell: info => <div>
                    {`${info.getValue()}` }
                    <br/>
                    <Button variant={`link`} onClick={() => props.renderDetails(`${info.getValue()}`)}>Ver Detalhes</Button>
                </div>,
                header: () => <span>Id</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => MyUtil.formatDate(row.scheduledDate!, true),
                id: 'scheduledDate',
                cell: info => info.getValue(),
                header: () => <span>Data e hora</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.visitInvestigators?.map(i => i.investigator?.name).join(", ")
                ,
                id: 'investigators',
                header: () => <span>Investigadores associados</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.researchPatient?.patient?.fullName,
                id: 'patientFullName',
                header: () => <span>Paciente</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => Object.values(VisitTypes).find(vt => vt.id === row.visitType)?.name,
                id: 'visitType',
                cell: info => info.getValue(),
                header: () => <span>Tipo de visita</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.observations,
                id: 'observation',
                header: () => <span>Observação</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.hasAdverseEventAlert ? "Sim" : "Não",
                id: 'hasAdverseEventAlert',
                header: () => <span>Evento Adverso</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.hasMarkedAttendance ? "Sim" : "Não",
                id: 'hasMarkedAttendance',
                header: () => <span>Concluída</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            }
        ],[props])



    const filterData = useCallback(() => {
        const filterMap = {
            "ALL": (visit: ResearchVisitModel) => true,
            "HISTORY": (visit: ResearchVisitModel) => MyUtil.cmpWithToday(visit.scheduledDate) < 0,
            "TO_HAPPEN": (visit: ResearchVisitModel) => MyUtil.cmpWithToday(visit.scheduledDate) >= 0
        }
        const match = (test: string) => (new RegExp(`${query}.*`,"gi")).test(test)

        const filters = {
            id: (visit: ResearchVisitModel) => match(visit.id!),
            observations: (visit: ResearchVisitModel) => match(visit.observations!),
            investigators: (visit: ResearchVisitModel) => match(visit.visitInvestigators!.join(", ")),
            patients: (visit: ResearchVisitModel) => match(visit.researchPatient!.patient!.fullName!),
        }

        return visits
            .filter(filterMap[showVisitHistory as keyof typeof filterMap])
            .filter(filters[searchProperty as keyof typeof filters])
    }, [visits, showVisitHistory, query, searchProperty])

    const handleSearchSubmit = (query: string) => setQuery(query)

    const [showEntryForm, setShowEntryForm] = useState<boolean>(false)
    const toggleShowEntryForm = () => setShowEntryForm(prevState => !prevState)
    const handleNewEntry = (newEntry: ResearchVisitModel) => {
        props.onAddVisit(newEntry)
    }


    return (
        <React.Fragment>
            <Container className={"border-top border-2 border-secondary"}>

                <Row className={"mt-5 mt-md-5"}>
                    <Col>
                        <SearchComponent handleSubmit={handleSearchSubmit}/>
                    </Col>
                    <Col/>
                    <Col>
                        <Form.Group>
                            <Form.Label>A visualizar</Form.Label>
                            <Form.Select
                                key={"visit-chrono-id"}
                                required
                                aria-label="research type selection"
                                name={"visit-chrono"}
                                defaultValue={VisitChrono.ALL.id}
                                onChange={handleVisitChronoChange}
                            >
                                {Object.values(VisitChrono).map(vc =>
                                    <option key={vc.id} value={vc.id}>{vc.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col aria-colspan={2}>
                        <Stack direction={"vertical"} gap={2} style={{position: "relative"}}>
                            <span className={"bold"}>Procurar por</span>
                            <FormGroup>
                                <Form.Select defaultValue={"id"} onChange={(e) => setSearchProperty(e.target.value)}>
                                    <option value={"id"}>Id</option>
                                    <option value={"patients"}>Pacientes</option>
                                    <option value={"investigators"}>Investigadores</option>
                                    <option value={"observations"}>Observações</option>
                                </Form.Select>
                            </FormGroup>
                        </Stack>
                    </Col>
                    <Col/>
                    <Col/>
                    <Col>

                    </Col>
                </Row>

                <br/>
                <br/>

                <Row>
                    {
                        !showEntryForm &&
                        <Container>
                            <Button variant={"outline-primary"} onClick={toggleShowEntryForm}>Nova entrada</Button>
                        </Container>
                    }
                    {showEntryForm &&
                        <VisitFormComponent
                            team={props.researchTeam}
                            onSave={handleNewEntry}
                            onCancel={toggleShowEntryForm}
                            patients={props.patients}
                        />
                    }
                </Row>
                <br/>
                <br/>

                {/*<Container>*/}
                {/*    <CSVLink*/}
                {/*        className={"float-end mb-2"}*/}
                {/*        headers={getHeaders()}*/}
                {/*        data={proposals.map(p => p.proposal)}*/}
                {/*        filename={`Propostas-${(new Date()).toLocaleDateString()}`}*/}
                {/*    >*/}
                {/*        {`Exportar selecionados ${checkBoxGroupState.totalCheckedItems > 0 ? `(${checkBoxGroupState.totalCheckedItems})` : ''} para Excel`}*/}
                {/*    </CSVLink>*/}
                {/*</Container>*/}

                <MyTable
                    data={filterData()}
                    columns={columns}
                />
            </Container>
        </React.Fragment>
    )
}

function VisitFormComponent(
    props: {
        patients: ResearchPatientModel[]
        team: TeamInvestigatorModel[],
        onCancel: () => void,
        onSave: (visit: ResearchVisitModel) => void
    }) {

    const freshVisit = (): ResearchVisitModel => ({
        id: "",
        researchId: "",
        researchPatientId: "",
        visitType: "",
        scheduledDate: "",
        startDate: "",
        endDate: "",
        periodicity: "",
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

    const filterInvestigatorsNotChosen = (investigator: TeamInvestigatorModel) => {
        return visit.visitInvestigators!.every(vi => vi.investigatorId !== investigator.memberId)
    }

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
                            <Form.Label className={"font-bold"}>Paciente</Form.Label>
                            <Select
                                placeholder={"-Escolher paciente-"}
                                onChange={onSelectPatient}
                                options={filteredPatients}
                                value={selectedPatient}
                                isSearchable
                            />
                         </div>
                    </Col>
                    <Col>
                        <Form.Group className={"m-2 m-md-2"}>
                            <Form.Label className={"font-bold"}>Nº Processo</Form.Label>
                            <Form.Control
                                disabled
                                value={visit.researchPatient!.patient!.processId}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={"m-2 m-md-2"}>
                            <Form.Label className={"font-bold"}>Idade</Form.Label>
                            <Form.Control
                                disabled
                                value={visit.researchPatient!.patient!.age}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={"m-2 m-md-2"}>
                            <Form.Label className={"font-bold"}>Género</Form.Label>
                            <Form.Control
                                disabled
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
                        {showPeriodic &&
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
                        <Dropdown style={{width: "100%"}}>
                            <Dropdown.Toggle className={"mb-2"} split variant={"outline-primary"}
                                             style={{width: "100%"}}>
                                Adicionar Investigador
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{width: "100%"}}>
                                {props.team?.length !== visit.visitInvestigators!.length ?
                                    props.team
                                        ?.filter(filterInvestigatorsNotChosen)
                                        ?.map((t, i) =>
                                            <Dropdown.Item key={i}
                                                           onClick={() => addInvestigatorToVisit(t.member!)}>
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
                            <ListGroup.Item className={"border-bottom border-secondary text-center"}>Investigadores
                                associados à visita <span style={{color: "red"}}>*</span></ListGroup.Item>

                            {visit.visitInvestigators!
                                .map((inv, idx) =>
                                    <ListGroup.Item key={inv.investigatorId} className={"flex-column"}
                                                    variant={(idx & 1) === 1 ? "dark" : "light"}>
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
                            <Form.Label
                                className={"font-bold"}>{showPeriodic ? "Dia da primeira visita" : "Data e hora"}<span
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