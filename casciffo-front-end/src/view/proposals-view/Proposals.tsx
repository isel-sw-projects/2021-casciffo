import React, {useEffect, useState} from "react";
import {Container, Table} from "react-bootstrap";
import ProposalService from "../../services/ProposalService";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {MyUtil} from "../../common/MyUtil";
import {Link} from "react-router-dom";
import {CSVLink} from "react-csv";
import {ResearchTypes} from "../../common/Constants";
import {STATES} from "../../model/state/STATES";
import {useErrorHandler} from "react-error-boundary";
import {CSVHeader} from "../../common/Types";
import {SearchComposite} from "../components/SearchComposite";

type Proposals_Props = {
    service: ProposalService
}

type ProposalRowInfo = {
    id: string,
    createdDate: string,
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
                    partnerships: hasFinancialComponent && p.financialComponent!.hasPartnerships ? "Sim" : "Não"
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

    function mapToRowElement(row: ProposalRow): JSX.Element {
        // const proposal = element as ProposalModel
        // const color = {
        //     backgroundColor: row.selected ? "#d3fcff" : "inherit"
        // }
        return (
            <tr key={`row-element-${row.proposal.id}`} id={`row-element-${row.proposal.id}`}>{/*style={color}*/}
                <td><input
                    type={"checkbox"}
                    checked={row.selected}
                    className={"form-check-input"}
                    id={`row-check-${row.proposal.id}`}
                    onChange={selectProposalRow(row)}/>
                </td>
                <td>
                    <span>{row.proposal.id}</span>
                    <br/>
                    <span><Link to={`${row.proposal.id}`}>Ver detalhes</Link></span>
                </td>
                <td>{row.proposal.createdDate}</td>
                <td>{row.proposal.sigla}</td>
                <td>{row.proposal.state}</td>
                <td>{row.proposal.pathology}</td>
                <td>{row.proposal.serviceType}</td>
                <td>{row.proposal.therapeuticArea}</td>
                <td>{row.proposal.principalInvestigator}</td>
                {row.proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                    <>
                        <td>{row.proposal.promoter}</td>
                        <td>{row.proposal.partnerships}</td>
                    </>
                    : <></>
                }
            </tr>
        )
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
            .map(mapToRowElement)
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
                {/*{*/}
                {/*    (*/}
                {/*        (researchType === ResearchTypes.CLINICAL_TRIAL.id && totalCount.trials > 0)*/}
                {/*        ||*/}
                {/*        (researchType === ResearchTypes.OBSVERTIONAL_STUDY.id && totalCount.studies > 0)*/}
                {/*    )*/}
                {/*    &&*/}
                {/*    <div>*/}
                {/*        <input type="button" value="Export to CSV (Async)" onClick={getAllProposals} />*/}
                {/*        <CSVLink*/}
                {/*            className={"float-end mb-2"}*/}
                {/*            headers={getHeaders()}*/}
                {/*            data={allData}*/}
                {/*            filename={`Propostas-${(new Date()).toLocaleDateString()}`}*/}
                {/*            ref={allProposalsLinkRef}>*/}
                {/*            {`Exportar todas (${researchType === ResearchTypes.CLINICAL_TRIAL.id ? totalCount.trials : totalCount.studies}) deste tipo`}*/}
                {/*        </CSVLink>*/}
                {/*</div>*/}
                {/*}*/}
            </Container>
            <Container>
            {/*TODO REPLACE WITH MyTable*/}
                <Table striped bordered hover size={"sm"} className={"border border-2"}>
                    <thead>
                    <tr key={"headers"}>
                        <th>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={checkBoxGroupState.masterChecked}
                                id="mastercheck"
                                onChange={onMasterCheck}
                            />
                        </th>
                        {getHeaders().map((h, i) => <th key={`${h.key}-${i}`}>{h.label}</th>)}
                    </tr>
                    </thead>
                    <tbody>

                    {isDataReady ?
                        <>
                            {filterProposals()}
                        </>
                        :
                        <>
                            <tr key={"template"}>
                                <td colSpan={getHeaders().length}>
                                    A carregar...
                                </td>
                            </tr>
                        </>
                    }

                    </tbody>
                </Table>
            </Container>
            {/*{isDataReady ?*/}
            {/*    <TableComponent*/}
            {/*        getData={() => proposals}*/}
            {/*        maxElementsPerPage={10}*/}
            {/*        fetchDataAsync={fetchProposals}*/}
            {/*        headers={researchType === ResearchTypes.CLINICAL_TRIAL.id? tableHeadersClinicalTrials : tableHeadersClinicalStudies}*/}
            {/*        mapDataToRow={mapProposalToRow}*/}
            {/*    /> : <></>*/}
            {/*}*/}

        </React.Fragment>
    )
}