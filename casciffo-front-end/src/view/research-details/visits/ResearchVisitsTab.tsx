import React, {useCallback, useEffect, useState} from "react";
import {MyUtil} from "../../../common/MyUtil";
import {ResearchAggregateModel, ResearchVisitModel} from "../../../model/research/ResearchModel";
import {ResearchTypes, VisitChrono, VisitTypes} from "../../../common/Constants";
import {ColumnDef} from "@tanstack/react-table";
import {Link, useParams} from "react-router-dom";
import {Button, Col, Container, Form, FormGroup, Row, Stack} from "react-bootstrap";
import {SearchComponent} from "../../components/SearchComponent";
import {MyTable} from "../../components/MyTable";

type VisitProps = {
    visits: ResearchVisitModel[]
    onAddVisit: (visit: ResearchVisitModel) => void
    renderDetails: () => void
}

export function ResearchVisitsTab(props: VisitProps) {
    const {researchId} = useParams()

    useEffect(() => {
       document.title = MyUtil.RESEARCH_VISITS_TITLE(researchId!)
    }, [researchId])


    const [visits, setVisits] = useState<ResearchVisitModel[]>([])
    const [query, setQuery] = useState("")
    const [searchProperty, setSearchProperty] = useState<keyof ResearchVisitModel>("visitType")
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
                    {info.getValue() as string}
                    <br/>
                    <Link to={`#vId=${info.getValue()}`} onClick={props.renderDetails}>Ver Detalhes</Link>
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
                accessorFn: row => row.patient?.fullName,
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
        ],[props.renderDetails])



    const filterData = useCallback(() => {
        const filterMap = {
            "ALL": (visit: ResearchVisitModel) => true,
            "HISTORY": (visit: ResearchVisitModel) => MyUtil.cmpWithToday(visit.scheduledDate) < 0,
            "TO_HAPPEN": (visit: ResearchVisitModel) => MyUtil.cmpWithToday(visit.scheduledDate) >= 0
        }

        return visits
            .filter(filterMap[showVisitHistory as keyof typeof filterMap])
            .filter(v => (new RegExp(`${query}.*`,"gi")).test(`${v[searchProperty]}`))
    }, [visits, showVisitHistory, query, searchProperty])

    const handleSearchSubmit = (query: string) => setQuery(query)

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
                                <Form.Select defaultValue={"sigla"} onChange={(e) => setSearchProperty(e.target.value as keyof ResearchVisitModel)}>
                                    <option value={"id"}>Identificador</option>
                                    <option value={"visitInvestigators"}>Investigadores</option>
                                    <option value={"observations"}>Patologia</option>
                                </Form.Select>
                            </FormGroup>
                        </Stack>
                    </Col>
                    <Col/>
                    <Col/>
                    <Col/>
                </Row>

                <br/>
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