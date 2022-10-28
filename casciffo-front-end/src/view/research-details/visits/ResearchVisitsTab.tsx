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
import {AsyncAutoCompletePatientSearch} from "../patients/AsyncAutoCompletePatientSearch";

type VisitProps = {
    visits: ResearchVisitModel[]
    onAddVisit: (visit: ResearchVisitModel) => void
    renderDetails: (vId: string) => void
    searchPatientsByProcessId: (pId: string) => Promise<PatientModel[]>
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

    const freshVisit = (): ResearchVisitModel => ({
        id: "",
        researchId: "",
        researchPatientId: "",
        concluded: false,
        visitType: "",
        scheduledDate: "",
        startDate: "",
        endDate: "",
        periodicity: "",
        observations: "",
        hasAdverseEventAlert: false,
        hasMarkedAttendance: false,
        researchPatient: {},
        visitInvestigators: []
    })

    const [newEntry, setNewEntry] = useState<ResearchVisitModel>(freshVisit())
    const [showEntryForm, setShowEntryForm] = useState<boolean>(false)

    const toggleShowEntryForm = () => setShowEntryForm(prevState => !prevState)

    const resetEntry = () => {
        setShowEntryForm(false)
        setNewEntry(freshVisit())
    }

    const handleNewEntry = () => {
        props.onAddVisit(newEntry)
        resetEntry()
    }

    const addInvestigatorToVisitEntry = (newInvestigator: UserModel) => {
        const ni: VisitInvestigator = {
            investigator: newInvestigator,
            investigatorId: newInvestigator.userId
        }
        setNewEntry(prevState => {
            const team = [ni, ...prevState.visitInvestigators ?? []]

            return {...prevState, visitInvestigators: team}
        })
    }

    const updateEntry = (e: any) => {
        const key = e.target.name as keyof ResearchVisitModel
        const value = e.target.value
        setNewEntry(prevState => ({
            ...prevState,
            [key]: value
        }))
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
                        {
                            !showEntryForm &&
                            <Button variant={"outline-primary"} onClick={toggleShowEntryForm}>Nova entrada</Button>
                        }
                    </Col>
                </Row>

                <br/>
                <br/>

                <Row>
                    {showEntryForm &&
                        <VisitFormComponent
                            team={props.researchTeam}
                            updateVisit={updateEntry}
                            visit={newEntry}
                            addInvestigatorToVisit={addInvestigatorToVisitEntry}
                            onSave={handleNewEntry}
                            onCancel={resetEntry}
                            searchByProcessId={props.searchPatientsByProcessId}
                        />}
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
        visit: ResearchVisitModel,
        searchByProcessId: (pId: string) => Promise<PatientModel[]>,
        updateVisit: (e: any) => void,
        team: TeamInvestigatorModel[],
        addInvestigatorToVisit: (newInvestigator: UserModel) => void,
        onCancel: () => void,
        onSave: (e: FormEvent<HTMLFormElement>) => void
    }) {

    const [visit, setVisit] = useState<ResearchVisitModel>({
        id: "",
        researchId: "",
        researchPatientId: "",
        visitType: "",
        scheduledDate: "",
        startDate: "",
        endDate: "",
        periodicity: "",
        visitInvestigators: []
    })

    const [patient, setPatient] = useState<PatientModel>({
        id: "",
        processId: "",
        fullName: "",
        gender: "",
        age: "",
    })

    useEffect(() => {
        setVisit(props.visit)
    }, [props.visit])

    const [showPeriodic, setPeriodic] = useState(false)
    const toggleShowPeriodic = () => setPeriodic(prevState => !prevState)

    const filterInvestigatorsNotChosen = (investigator: TeamInvestigatorModel) => {
        return visit.visitInvestigators!.every(vi => vi.investigatorId !== investigator.memberId)
    }

    const onSelectPatient = (patient: PatientModel) => setPatient(patient)

    return (
        <Form key={`visit-form`}
              className={"m-2 m-md-2"}
              onSubmit={props.onSave}>
            <fieldset className={"border p-3 border-secondary"}>
                <legend className={"float-none w-auto p-2"}>Nova visita</legend>
                <Row>
                    <Col>
                        <div className={"m-2 m-md-2"}>
                            {/*TODO CHANGE SEARCH BY ID TO JUST SEND A FILTERED LIST OF THE PARTICIPANTS BASED ON THE QUERY*/}
                            <AsyncAutoCompletePatientSearch requestPatients={props.searchByProcessId} setPatient={onSelectPatient}/>
                        </div>
                    </Col>
                    <Col>
                        <Form.Group className={"m-2 m-md-2"}>
                            <Form.Label className={"text-bold"}>Género</Form.Label>
                            <Form.Control
                                disabled
                                value={patient.gender}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={"m-2 m-md-2"}>
                            <Form.Label className={"text-bold"}>Género</Form.Label>
                            <Form.Control
                                disabled
                                value={patient.gender}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={"m-2 m-md-2"}>
                            <Form.Label className={"text-bold"}>Género</Form.Label>
                            <Form.Control
                                disabled
                                value={patient.gender}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
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
                                onChange={props.updateVisit}
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
                                    onChange={props.updateVisit}
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
                                               onChange={props.updateVisit}
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
                                                           onClick={() => props.addInvestigatorToVisit(t.member!)}>
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
                                onChange={props.updateVisit}
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
                                    onChange={props.updateVisit}
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