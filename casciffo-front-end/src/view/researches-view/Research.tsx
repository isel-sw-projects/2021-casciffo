import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import React, {useCallback, useEffect, useState} from "react";
import {ResearchTabNames, ResearchTypes} from "../../common/Constants";
import {MyUtil} from "../../common/MyUtil";
import {Link} from "react-router-dom";
import {Col, Container, Form, FormGroup, Row, Stack} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import {ResearchAggregateModel} from "../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";
import {SearchBar} from "../components/SearchBar";
import {CSVLink} from "react-csv";
import {CSVHeader} from "../../common/Types";
import {STATES} from "../../model/state/STATES";
import {SearchComposite} from "../components/SearchComposite";


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

    useEffect(() => {
        setIsDataReady(false)
        props.researchService
            .fetchByType(researchType)
            .then(values => setEnsaios(values.map(r => ({selected: false, research: r}))))
            .then(() => setIsDataReady(true))
    }, [props.researchService, researchType])


    const handleResearchTypeChange = (type: string) => setResearchType(type)

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
                    accessorFn: row => STATES[row.research.stateName as keyof typeof STATES].name,
                    id: 'state',
                    header: () => <span>Estado</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                }]
        },[checkedInfo.masterCheck, ensaios.length])

    

    const filterData = useCallback(() => {
        return ensaios.filter(e => {
            const regExp = new RegExp(`${query}.*`,"gmi")
            return regExp.test(`${e.research[searchProperty]}`)
        })
    }, [ensaios, query, searchProperty])

    const handleSearchSubmit = (query: string) => setQuery(query)

    const onSearchPropertyChange = (property: string) => setSearchProperty(property as keyof ResearchAggregateModel)

    const searchProperties = [
        {value: "sigla",                        label: "Sigla"},
        {value: "id",                           label: "Identificador"},
        {value: "pathologyName",                label: "Patologias"},
        {value: "serviceTypeName",              label: "Tipo de serviço"},
        {value: "therapeuticAreaName",          label: "Área terapeutica"},
        {value: "stateName",                    label: "Estado"}
    ]
    if(researchType === ResearchTypes.CLINICAL_TRIAL.id) {
        searchProperties.push({value: "promoterName", label: "Promotor"})
    }

    return (
        <React.Fragment>
            <Container className={"mt-5"}>
                <SearchComposite
                    handleSubmit={handleSearchSubmit}
                    searchProperties={searchProperties}
                    onSearchPropertyChange={onSearchPropertyChange}
                    includeVisualizeType
                    defaultVisualizeType={ResearchTypes.CLINICAL_TRIAL.id}
                    visualizeTypes={Object.values(ResearchTypes).map((rt) => ({label: rt.name, value: rt.id}))}
                    onVisualizeTypeChange={handleResearchTypeChange}
                />
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