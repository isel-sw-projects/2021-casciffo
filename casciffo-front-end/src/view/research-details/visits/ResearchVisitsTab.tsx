import React, {useCallback, useEffect, useState} from "react";
import {MyUtil} from "../../../common/MyUtil";
import {
    ResearchPatientModel,
    ResearchVisitModel
} from "../../../model/research/ResearchModel";
import {VisitChrono, VisitTypes} from "../../../common/Constants";
import {ColumnDef} from "@tanstack/react-table";
import {useParams} from "react-router-dom";
import {Button, Col, Container, Form, FormGroup, Row, Stack} from "react-bootstrap";
import {SearchComponent} from "../../components/SearchComponent";
import {MyTable} from "../../components/MyTable";
import {TeamInvestigatorModel} from "../../../model/user/TeamInvestigatorModel";
import {VisitFormComponent} from "./VisitFormComponent";

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
            "ALL": (_: ResearchVisitModel) => true,
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
        toggleShowEntryForm()
    }


    return (
        <React.Fragment>
            <Container className={"border-top border-2 border-secondary"}>
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

                <Row className={"mt-5 mt-md-5"}>
                    <Col aria-colspan={2}>
                        <Stack direction={"horizontal"} gap={2} style={{position: "relative"}}>
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

                    <Col/>
                    <Col/>
                    <Col>

                    </Col>
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
                    pagination
                    data={filterData()}
                    columns={columns}
                />
            </Container>
        </React.Fragment>
    )
}