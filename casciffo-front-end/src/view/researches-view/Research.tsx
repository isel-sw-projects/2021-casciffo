import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import React, {useCallback, useEffect, useState} from "react";
import {ResearchTabNames, ResearchTypes} from "../../common/Constants";
import {MyUtil} from "../../common/MyUtil";
import {Link} from "react-router-dom";
import {Col, Container, Form, FormGroup, Row, Stack} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import {ResearchAggregateModel} from "../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";
import {SearchComponent} from "../components/SearchComponent";
import {CSVLink} from "react-csv";
import {CSVHeader} from "../../common/Types";


type ResearchRow = {
    selected: false
    research: ResearchAggregateModel
}

export function Research(props: { researchService: ResearchAggregateService }) {
    useEffect(() => {
        document.title = MyUtil.RESEARCH_TITLE
    })


    const [ensaios, setEnsaios] = useState<ResearchRow[]>([])
    const [checkedInfo, setCheckedInfo] = useState({masterCheck: false, nSelected: 0})
    const [isDataReady, setIsDataReady] = useState(false)
    const [researchType, setResearchType] = useState<string>(ResearchTypes.CLINICAL_TRIAL.id)
    const [query, setQuery] = useState("")
    const [searchProperty, setSearchProperty] = useState<keyof ResearchAggregateModel>("sigla")

    //todo get all research for excel
    // const [totalCount, setTotalCount] = useState({trials: 0, studies: 0})
    // useEffect(() => {
    //     props.researchService
    //         .getResearchCount()
    //         .then(value => console.log(value))
    // }, [props.researchService])

    useEffect(() => {
        setIsDataReady(false)
        props.researchService
            .fetchByType(researchType)
            .then(values => setEnsaios(values.map(r => ({selected: false, research: r}))))
            .then(() => setIsDataReady(true))
    }, [props.researchService, researchType])


    const handleResearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => setResearchType(event.target.value)

    const tableHeadersClinicalTrials: CSVHeader<ResearchAggregateModel>[] = React.useMemo(() =>
        [
            {label:"Id", key:"id"},
            {label:"Tipo de ensaio", key:"type"},
            {label:"Data começo", key: "startDate"},
            {label:"Data fim", key: "endDate"},
            {label:"Data fim (estimada)", key: "estimatedEndDate"},
            {label: "Investigador Principal", key:"principalInvestigatorName"},
            {label: "Email", key:"principalInvestigatorEmail"},
            {label: "Eudra CT", key:"eudra_ct"},
            {label: "Qt. Amostra", key:"sampleSize"},
            {label: "Duração", key:"duration"},
            {label: "CRO", key:"cro"},
            {label: "Indústria", key:"industry"},
            {label: "Protocolo", key:"protocol"},
            {label: "Iniciativa", key:"initiativeBy"},
            {label: "Fase", key:"phase"},
            {label:"Sigla", key:"sigla"},
            {label:"Estado", key:"stateName"},
            {label:"Patologia", key:"pathologyName"},
            {label:"Serviço", key: "serviceName"},
            {label:"Área terapeutica", key:"therapeuticAreaName"},
            {label:"Promotor", key:"promoterName"},
            {label:"Parcerias", key:"hasPartnerships"}
        ], [])
    const tableHeadersClinicalStudies: CSVHeader<ResearchAggregateModel>[] =
        React.useMemo(() =>
        [
            {label:"Id", key:"id"},
            {label:"Tipo de ensaio", key:"type"},
            {label:"Data começo", key: "startDate"},
            {label:"Data fim", key: "endDate"},
            {label:"Data fim (estimada)", key: "estimatedEndDate"},
            {label: "Investigador Principal", key:"principalInvestigatorName"},
            {label: "Email", key:"principalInvestigatorEmail"},
            {label: "Eudra CT", key:"eudra_ct"},
            {label: "Qt. Amostra", key:"sampleSize"},
            {label: "Duração", key:"duration"},
            {label: "CRO", key:"cro"},
            {label: "Indústria", key:"industry"},
            {label: "Protocolo", key:"protocol"},
            {label: "Iniciativa", key:"initiativeBy"},
            {label: "Fase", key:"phase"},
            {label:"Sigla", key:"sigla"},
            {label:"Estado", key:"stateName"},
            {label:"Patologia", key:"pathologyName"},
            {label:"Serviço", key: "serviceName"},
            {label:"Área terapeutica", key:"therapeuticAreaName"},
        ], [])

    const getHeaders = (): CSVHeader<ResearchAggregateModel>[] =>
        researchType === ResearchTypes.CLINICAL_TRIAL.id? tableHeadersClinicalTrials : tableHeadersClinicalStudies



    const columns = React.useMemo<ColumnDef<ResearchRow>[]>(
        () => {
            const selectResearch = (row: ResearchRow) => (e: any) => {
                setCheckedInfo(prevState => {
                    const selected = prevState.nSelected - Math.pow(-1, e.target.checked)
                    return {
                        nSelected: selected,
                        masterCheck: selected === ensaios.length
                    }
                })
                setEnsaios(prevState => prevState.map(r => {
                    if(r.research.id === row.research.id) {
                        r.selected = e.target.checked
                    }
                    return r
                }))
            }
            const selectAllResearch = (e: any) => {
                setCheckedInfo({masterCheck: e.target.checked, nSelected: e.target.checked ? ensaios.length : 0})
                setEnsaios(prevState => prevState.map(r => {
                    r.selected = e.target.checked
                    return r
                }))
            }
            return [
                {
                    accessorFn: row => <input
                        type={"checkbox"}
                        checked={row.selected}
                        className={"form-check-input"}
                        id={`row-check-${row.research.id}`}
                        onChange={selectResearch(row)}/>,
                    id: 'checkbox-button',
                    header: () => <input
                        type={"checkbox"}
                        checked={checkedInfo.masterCheck}
                        className={"form-check-input"}
                        id={`master-check`}
                        onChange={selectAllResearch}/>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.research.id,
                    id: 'id',
                    cell: info => <div>
                        <span>{info.getValue() as string}</span>
                        <br/>
                        <Link to={`${info.getValue()}#t=${ResearchTabNames.research}`}>Ver Detalhes</Link>
                    </div>,
                    header: () => <span>Id</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.research.startDate?.substring(0, 4) || "Não definido",
                    id: 'startDate',
                    cell: info => info.getValue(),
                    header: () => <span>Ano de entrada</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.research.sigla,
                    id: 'sigla',
                    cell: info => info.getValue(),
                    header: () => <span>Sigla</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.research.promoterName,
                    id: 'promoterName',
                    header: () => <span>Promotor</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.research.serviceName,
                    id: 'serviceType',
                    header: () => <span>Serviço</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.research.pathologyName,
                    id: 'pathologyName',
                    header: () => <span>Patologia</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.research.therapeuticAreaName,
                    id: 'therapeuticAreaName',
                    header: () => <span>Área terapeutica</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.research.stateName,
                    id: 'state',
                    header: () => <span>Estado</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                }]
        },[checkedInfo.masterCheck, ensaios.length])

    

    const filterData = useCallback(() => {
        return ensaios.filter(e => {
            const regExp = new RegExp(`${query}.*`,"gmi")
            const cmp = regExp.test(`${e.research[searchProperty]}`)
            console.log(`/${regExp.source}/.test("${e.research[searchProperty]}")=${cmp}`)
            return cmp
        })
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

                 <div>
                     {
                         checkedInfo.nSelected === 0
                             ? <div className={"float-start mb-2"}>
                                 Exportar selecionados (0) para Excel
                             </div>
                             : <CSVLink
                                    separator={";"}
                                    className={"float-start mb-2"}
                                    headers={getHeaders()}
                                    data={ensaios.filter(p => p.selected).map(p => ({
                                        ...p.research,
                                        type: researchType
                                    }))}
                                    filename={`Propostas-${(new Date()).toLocaleDateString()}`}>
                                    {`Exportar selecionados ${checkedInfo.nSelected > 0 ? `(${checkedInfo.nSelected})` : ''} para Excel`}
                            </CSVLink>
                     }
                     {/*{*/}
                     {/*    (*/}
                     {/*        (researchType === ResearchTypes.CLINICAL_TRIAL.id && totalCount.trials > 0)*/}
                     {/*        ||*/}
                     {/*        (researchType === ResearchTypes.OBSVERTIONAL_STUDY.id && totalCount.studies > 0)*/}
                     {/*    )*/}
                     {/*    &&*/}
                     {/*    <CSVLink className={"float-end mb-2"}*/}
                     {/*             headers={getHeaders()}*/}
                     {/*             data={getAllResearch()}*/}
                     {/*             filename={`Ensaios-${(new Date()).toLocaleDateString()}`}>*/}
                     {/*        {`Exportar todas (${researchType === ResearchTypes.CLINICAL_TRIAL.id ? totalCount.trials : totalCount.studies}) deste tipo`}*/}
                     {/*    </CSVLink>*/}
                     {/*}*/}
                 </div>
                <br/>

                <MyTable
                    pagination
                    loading={!isDataReady}
                    data={filterData()}
                    columns={columns}
                />

            </Container>
        </React.Fragment>
    )
}