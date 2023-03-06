import React, {useEffect, useState} from "react";
import {Container, Table} from "react-bootstrap";
import ProposalService from "../../services/ProposalService";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {MyUtil} from "../../common/MyUtil";
import {Link} from "react-router-dom";
import {CSVLink} from "react-csv";
import {ResearchTabNames, ResearchTypes} from "../../common/Constants";
import {STATES} from "../../model/state/STATES";
import {useErrorHandler} from "react-error-boundary";
import {CSVHeader} from "../../common/Types";
import {SearchComposite} from "../components/SearchComposite";
import {MyTable} from "../components/MyTable";
import {ColumnDef} from "@tanstack/react-table";

type Proposals_Props = {
    service: ProposalService
}

type ProposalRowInfo = {
    id: string,
    createdDate: string,
    lastModified: string,
    sigla: string,
    state: string,
    pathology: string,
    serviceType: string,
    therapeuticArea: string,
    principalInvestigator: string,
    type: string,
    promoter?: string,
    partnerships?: string
}

type ProposalRow = {
    selected: boolean,
    proposal: ProposalRowInfo
}

export function Proposals(props: Proposals_Props) {

    useEffect(() => {
        document.title = MyUtil.PROPOSALS_TITLE
    })

    const tableHeadersClinicalTrials: CSVHeader<ProposalRowInfo>[] = [
        {label:"Id", key:"id"}, {label:"Data criada", key: "createdDate"}, {label:"Sigla", key:"sigla"},
        {label:"Estado", key:"state"}, {label:"Patologia", key:"pathology"}, {label:"Serviço", key: "serviceType"},
        {label:"Área terapeutica", key:"therapeuticArea"}, {label: "Investigador Principal", key:"principalInvestigator"},
        {label:"Promotor", key:"promoter"}, {label:"Parcerias", key:"partnerships"}
    ]
    const tableHeadersClinicalStudies: CSVHeader<ProposalRowInfo>[] = tableHeadersClinicalTrials.slice(0, -2)

    const [proposals, setProposals] = useState<ProposalRow[]>([])
    const [isDataReady, setIsDataReady] = useState(false)
    const [researchType, setResearchType] = useState<string>(ResearchTypes.CLINICAL_TRIAL.id)
    const [query, setQuery] = useState("")
    const [searchProperty, setSearchProperty] = useState<keyof ProposalRowInfo>("sigla")
    const [checkBoxGroupState, setCheckBoxGroupState] = useState({
        totalCheckedItems: 0,
        masterChecked: false
    })

    const handleError = useErrorHandler()

    function updateCheckBoxGroup(value: ProposalModel[]) {
        setCheckBoxGroupState({
            totalCheckedItems: 0,
            masterChecked: false
        })
        return value
    }

    function displayData() {
        setIsDataReady(true)
    }


    //by including researchType in the second parameter, every time it changes, this effect runs automatically
    useEffect(() => {
        function mapToProposalRow(value: ProposalModel[]) {
            const hasFinancialComponent= researchType === ResearchTypes.CLINICAL_TRIAL.id
            let rows = value.map(p => ({
                selected: false,
                proposal: {
                    id: p.id!.toString(),
                    createdDate: MyUtil.formatDate(p.createdDate!),
                    sigla: p.sigla,
                    state: STATES[p.state!.name as keyof typeof STATES].name,
                    pathology: p.pathology!.name!,
                    serviceType: p.serviceType!.name!,
                    therapeuticArea: p.therapeuticArea!.name!,
                    principalInvestigator: p.principalInvestigator!.name!,
                    type: p.type,
                    promoter: hasFinancialComponent ? p.financialComponent!.promoter!.name : undefined,
                    partnerships: hasFinancialComponent && p.financialComponent!.hasPartnerships ? "Sim" : "Não",
                    lastModified: MyUtil.formatDate(p.lastModified!, true)
                }
            }))
            setProposals(rows)
        }
        const resetSearchProperty = () => {
            setSearchProperty("sigla")
        }
        setIsDataReady(false)
        props.service
            .fetchByType(researchType)
            .then(updateCheckBoxGroup)
            .then(mapToProposalRow)
            .then(resetSearchProperty)
            .then(displayData)
            .catch(handleError)
    }, [props.service, researchType, handleError])

    function handleSearchSubmit(query: string) {
        setQuery(query)
    }

    function handleResearchTypeChange(type: string) {
        setResearchType(type)
    }


    function getHeaders() : CSVHeader<ProposalRowInfo>[] {
        return researchType === ResearchTypes.CLINICAL_TRIAL.id? tableHeadersClinicalTrials : tableHeadersClinicalStudies
    }


    function filterProposals() {
        const regExp = new RegExp(`${query}.*`, "gi")
        return proposals
            .filter(p => query === "" || regExp.test(p.proposal[searchProperty]!))
    }

    const searchProperties = [
        {value: "sigla",                 label: "Sigla"},
        {value: "id",                    label: "Identificador"},
        {value: "pathology",             label: "Patologias"},
        {value: "serviceType",           label: "Tipo de serviço"},
        {value: "therapeuticArea",       label: "Área terapeutica"},
        {value: "state",                 label: "Estado"},
    ]

    const onSearchPropertiesChange = (property: any) => setSearchProperty(property as keyof ProposalRowInfo)


    const columns = React.useMemo<ColumnDef<ProposalRow>[]>(
        () => {
            function onMasterCheck(event: React.ChangeEvent<HTMLInputElement>) {
                let checkedProposals = proposals.map(p => {p.selected = event.target.checked; return p})

                setCheckBoxGroupState({
                    masterChecked: event.target.checked,
                    totalCheckedItems: event.target.checked ? checkedProposals.length : 0
                })
                setProposals(checkedProposals)
            }

            function selectProposalRow(row: ProposalRow) {
                return (event: React.ChangeEvent<HTMLInputElement>) => {
                    let _totalCheckedItems = checkBoxGroupState.totalCheckedItems + (event.target.checked ? 1 : -1)
                    row.selected = event.target.checked
                    setCheckBoxGroupState(prevState => ({
                        ...prevState,
                        totalCheckedItems: _totalCheckedItems,
                        masterChecked: _totalCheckedItems === proposals.length
                    }))
                    let tableData = proposals.map(p => {
                        if (p.proposal.id === row.proposal.id) {
                            p.selected = event.target.checked
                        }
                        return p
                    })
                    setProposals(tableData)
                }
            }

            const defaultColumns: ColumnDef<ProposalRow>[] =  [
                {
                    accessorFn: row => <input
                        type={"checkbox"}
                        checked={row.selected}
                        className={"form-check-input"}
                        id={`row-check-${row.proposal.id}`}
                        onChange={selectProposalRow(row)}/>,
                    id: 'checkbox-button',
                    header: () => <input
                        type={"checkbox"}
                        checked={checkBoxGroupState.masterChecked}
                        className={"form-check-input"}
                        id={`master-check`}
                        onChange={onMasterCheck}/>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.proposal.id,
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
                    accessorFn: row => row.proposal.createdDate,
                    id: 'startDate',
                    cell: info => info.getValue(),
                    header: () => <span>Data de submissão</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.proposal.lastModified,
                    id: 'lastUpdated',
                    cell: info => info.getValue(),
                    header: () => <span>Última atualização</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.proposal.sigla,
                    id: 'sigla',
                    cell: info => info.getValue(),
                    header: () => <span>Sigla</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.proposal.promoter,
                    id: 'promoter',
                    header: () => <span>Promotor</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id
                },
                {
                    accessorFn: row => row.proposal.serviceType,
                    id: 'serviceType',
                    header: () => <span>Serviço</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.proposal.pathology,
                    id: 'pathology',
                    header: () => <span>Patologia</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.proposal.therapeuticArea,
                    id: 'therapeuticArea',
                    header: () => <span>Área terapeutica</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.proposal.state,
                    id: 'state',
                    header: () => <span>Estado</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                }]
            return defaultColumns
        },[checkBoxGroupState.masterChecked, checkBoxGroupState.totalCheckedItems, proposals])

    return (
        <React.Fragment>
            <br/>
            <br/>
            <br/>
            <Container>
                <SearchComposite
                    handleSubmit={handleSearchSubmit}
                    searchProperties={searchProperties}
                    onSearchPropertyChange={onSearchPropertiesChange}
                    includeVisualizeType
                    visualizeTypes={Object.values(ResearchTypes).map((rt) => ({label: rt.name, value: rt.id}))}
                    defaultVisualizeType={ResearchTypes.CLINICAL_TRIAL.id}
                    onVisualizeTypeChange={handleResearchTypeChange}
                    />

                <Link to={`criar`} className={"btn btn-primary float-end mt-5"}>Criar Proposta</Link>
            </Container>

            <br/>
            <br/>
            <br/>
            <Container>
                {
                    checkBoxGroupState.totalCheckedItems === 0
                        ? <div className={"float-start mb-2"}>
                            Exportar selecionados (0) para Excel
                        </div>
                        : <CSVLink
                            className={"float-start mb-2"}
                            headers={getHeaders()}
                            data={proposals.filter(p => p.selected).map(p => p.proposal)}
                            filename={`Propostas-${(new Date()).toLocaleDateString()}`}
                        >
                            {`Exportar selecionados ${checkBoxGroupState.totalCheckedItems > 0 ? `(${checkBoxGroupState.totalCheckedItems})` : ''} para Excel`}
                        </CSVLink>
                }
            </Container>

            <Container>
                <MyTable
                    pagination
                    loading={!isDataReady}
                    emptyDataPlaceholder={"Não há propostas registadas."}
                    data={filterProposals()}
                    columns={columns}
                    toHide={[{visible: researchType !== ResearchTypes.OBSERVATIONAL_STUDY.id, columnId: "promoter"}]}
                />
            </Container>

        </React.Fragment>
    )
}