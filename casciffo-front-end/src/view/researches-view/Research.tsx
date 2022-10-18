import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import React, {useCallback, useEffect, useState} from "react";
import {ResearchTypes} from "../../common/Constants";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {MyUtil} from "../../common/MyUtil";
import {Link} from "react-router-dom";
import {Col, Container, FloatingLabel, Form, FormGroup, Row, Stack} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import {ResearchAggregateModel, ResearchModel} from "../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";
import {FormInputHelper} from "../components/FormInputHelper";
import {SearchComponent} from "../components/SearchComponent";
import {CSVLink} from "react-csv";


export function Research(props: { researchService: ResearchAggregateService }) {
    useEffect(() => {
        document.title = MyUtil.RESEARCH_TITLE
    })


    const [ensaios, setEnsaios] = useState<ResearchAggregateModel[]>([])
    const [isDataReady, setIsDataReady] = useState(false)
    const [researchType, setResearchType] = useState<string>(ResearchTypes.CLINICAL_TRIAL.id)
    const [query, setQuery] = useState("")
    const [searchProperty, setSearchProperty] = useState<keyof ResearchAggregateModel>("sigla")

    useEffect(() => {
        setIsDataReady(false)
        props.researchService
            .fetchByType(researchType)
            .then(setEnsaios)
            .then(() => setIsDataReady(true))
    }, [props.researchService, researchType])


    const handleResearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => setResearchType(event.target.value)
    


    // function getHeaders() : CSVHeader[] {
    //     return researchType === ResearchTypes.CLINICAL_TRIAL.id? tableHeadersClinicalTrials : tableHeadersClinicalStudies
    // }


    const columns = React.useMemo<ColumnDef<ResearchAggregateModel>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                cell: info => <div>
                    <span>{info.getValue() as string}</span>
                    <br/>
                    <Link to={`${info.getValue()}#t=research`}>Ver Detalhes</Link>
                </div>,
                header: () => <span>Id</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.startDate?.substring(0, 4) || "Não definido",
                id: 'startDate',
                cell: info => info.getValue(),
                header: () => <span>Ano de entrada</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.sigla,
                id: 'sigla',
                cell: info => info.getValue(),
                header: () => <span>Sigla</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.promoterName,
                id: 'promoterName',
                header: () => <span>Promotor</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.serviceName,
                id: 'serviceType',
                header: () => <span>Serviço</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.pathologyName,
                id: 'pathologyName',
                header: () => <span>Patologia</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.therapeuticAreaName,
                id: 'therapeuticAreaName',
                header: () => <span>Área terapeutica</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.stateName,
                id: 'state',
                header: () => <span>Estado</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            }],[])

    

    const filterData = useCallback(() => {
        return ensaios.filter(e => (new RegExp(`${query}.*`,"gi")).test(`${e[searchProperty]}`))
    }, [ensaios, query, searchProperty])

    const handleSearchSubmit = (query: string) => setQuery(query)

    return (
        <React.Fragment>
            <Container className={"mt-5"}>

                <Row>
                    <Col>
                        <SearchComponent handleSubmit={handleSearchSubmit}/>
                    </Col>
                    <Col/>
                    <Col>
                        <Form.Group>
                            <Form.Label>A visualizar</Form.Label>
                            <Form.Select
                                key={"research-type-id"}
                                required
                                aria-label="research type selection"
                                name={"researchType"}
                                defaultValue={ResearchTypes.CLINICAL_TRIAL.id}
                                onChange={handleResearchTypeChange}
                            >
                                {Object.values(ResearchTypes).map((rt) => (
                                    <option key={rt.id} value={rt.id}>{rt.name}</option>
                                ))}
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
                                <Form.Select defaultValue={"sigla"} onChange={(e) => setSearchProperty(e.target.value as keyof ResearchAggregateModel)}>
                                    <option value={"id"}>Identificador</option>
                                    <option value={"sigla"}>Sigla</option>
                                    <option value={"pathologyName"}>Patologia</option>
                                    <option value={"stateName"}>Estado</option>
                                    <option value={"therapeuticAreaName"}>Área terapeutica</option>
                                    {researchType === ResearchTypes.CLINICAL_TRIAL.id &&
                                        <option value={"promoterName"}>Promotor</option>
                                    }
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

                {/*TODO*/}
                {/* <Container>*/}
                {/*    <CSVLink*/}
                {/*        className={"float-end mb-2"}*/}
                {/*        headers={getHeaders()}*/}
                {/*        data={proposals.map(p => p.proposal)}*/}
                {/*        filename={`Propostas-${(new Date()).toLocaleDateString()}`}*/}
                {/*    >*/}
                {/*        {`Exportar selecionados ${checkBoxGroupState.totalCheckedItems > 0 ? `(${checkBoxGroupState.totalCheckedItems})` : ''} para Excel`}*/}
                {/*    </CSVLink>*/}
                {/* </Container>*/}


                {isDataReady &&
                    <MyTable
                        data={filterData()}
                        columns={columns}
                    />
                }

            </Container>
        </React.Fragment>
    )
}