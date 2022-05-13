import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row, Stack, Table} from "react-bootstrap";
import ProposalService from "../../services/ProposalService";
import {SearchComponent} from "../util-components/SearchComponent";
import {PaginationComponent} from "../util-components/PaginationComponent";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {ResearchTypes} from "../../model/ResearchTypes";
import {Util} from "../../common/Util";
import {Link} from "react-router-dom";
import {CSVLink} from "react-csv";

type Proposals_Props = {
    service: ProposalService
}

type ProposalRowInfo = {
    id: number,
    dataSubmetido: string,
    sigla: string,
    estado: string,
    patologia: string,
    servico: string,
    areaTerapeutica: string,
    investigadorPrincipal: string,
    tipo: string,
    promotor?: string,
    parcerias?: string
}

type ProposalRow = {
    selected: boolean,
    proposal: ProposalRowInfo
}

export function Proposals(props: Proposals_Props) {
    const service = props.service

    const tableHeadersClinicalTrials = ["Id", "Data criada", "Sigla", "Estado",
        "Patologia", "Serviço", "Área terapeutica", "Investigador Principal",
        "Promotor", "Parcerias"]
    const tableHeadersClinicalStudies = ["Id", "Data criada", "Sigla", "Estado",
        "Patologia", "Serviço", "Área terapeutica", "Investigador Principal"]

    const [proposals, setProposals] = useState<ProposalRow[]>([])
    const [isDataReady, setIsDataReady] = useState(false)
    const [researchType, setResearchType] = useState<string>(ResearchTypes.CLINICAL_TRIAL.id)
    //TODO implement sort
    const [sortBy, setSortBy] = useState<keyof ProposalModel>("id")
    const [searchProperty, setSearchProperty] = useState<keyof ProposalModel>("sigla")
    const [checkBoxGroupState, setCheckBoxGroupState] = useState({
        totalCheckedItems: 0,
        masterChecked: false
    })

    function mapToProposalRow(value: ProposalModel[]) {
        const hasFinancialComponent= researchType === ResearchTypes.CLINICAL_TRIAL.id
        let rows = value.map(p => ({
            selected: false,
            proposal: {
                id: p.id!,
                dataSubmetido: Util.formatDate(p.dateCreated!),
                sigla: p.sigla,
                estado: p.state!.name,
                patologia: p.pathology!.name,
                servico: p.serviceType!.name,
                areaTerapeutica: p.therapeuticArea!.name,
                investigadorPrincipal: p.principalInvestigator!.name,
                tipo: p.type,
                promotor: hasFinancialComponent ? p.financialComponent!.promoter.name : undefined,
                parcerias: hasFinancialComponent && p.financialComponent!.partnerships !== null ? "Sim" : "Não"
            }
        }))
        setProposals(rows)
    }

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
        console.log("fetching data...")
        service.fetchByType(researchType, sortBy)
            .then(updateCheckBoxGroup)
            .then(mapToProposalRow)
            .then(displayData)
    }, [service, researchType])

    function handleSearchSubmit(query: string) {
        console.log(`${query} with searchProperty: ${searchProperty}`)
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
        return (
            <tr key={`row-element-${row.proposal.id}`} id={`row-element-${row.proposal.id}`}>
                <td><input
                    type={"checkbox"}
                    checked={row.selected}
                    className={"form-check-input"}
                    id={`row-check-${row.proposal.id}`}
                    onChange={selectProposalRow(row)}
                /></td>
                <td>
                    <span>{row.proposal.id}</span>
                    <span><Link to={`${row.proposal.id}`}>Ver detalhes</Link></span>
                </td>
                <td>{row.proposal.dataSubmetido}</td>
                <td>{row.proposal.sigla}</td>
                <td>{row.proposal.estado}</td>
                <td>{row.proposal.patologia}</td>
                <td>{row.proposal.servico}</td>
                <td>{row.proposal.areaTerapeutica}</td>
                <td>{row.proposal.investigadorPrincipal}</td>
                {row.proposal.tipo === ResearchTypes.CLINICAL_TRIAL.id ?
                    <>
                        <td>{row.proposal.promotor}</td>
                        <td>{row.proposal.parcerias}</td>
                    </>
                    : <></>
                }
                {/*<td>{row.proposal.id}</td>*/}
                {/*<td>{Util.formatDate(row.proposal.dateCreated!)}</td>*/}
                {/*<td>{row.proposal.sigla}</td>*/}
                {/*<td>{row.proposal.state!.name}</td>*/}
                {/*<td>{row.proposal.pathology!.name}</td>*/}
                {/*<td>{row.proposal.serviceType!.name}</td>*/}
                {/*<td>{row.proposal.therapeuticArea!.name}</td>*/}
                {/*<td>{row.proposal.principalInvestigator!.name}</td>*/}
                {/*{row.proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?*/}
                {/*    <>*/}
                {/*        <td>{row.proposal.financialComponent!.promoter.name}</td>*/}
                {/*        <td>{row.proposal.financialComponent!.partnerships !== null ? "Sim" : "Não"}</td>*/}
                {/*    </>*/}
                {/*    : <></>*/}
                {/*}*/}
            </tr>
        )
    }

    function handleResearchTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setResearchType(event.target.value)
    }


    function getHeaders() : string[] {
        return researchType === ResearchTypes.CLINICAL_TRIAL.id? tableHeadersClinicalTrials : tableHeadersClinicalStudies
    }

    function handleExportToExcel() {

    }

    return (
        <React.Fragment>
            <br/>
            <br/>
            <br/>
            <Container>
            <Row>
                <Col>
                    <SearchComponent handleSubmit={handleSearchSubmit}/>
                </Col>
                <Col/>
                <Col>
                    {/*<Form.Group>*/}
                    {/*    <Form.Label>Filtros</Form.Label>*/}
                    {/*    <Form.Check></Form.Check>*/}
                    {/*</Form.Group>*/}
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>A visualizar</Form.Label>
                        <Form.Select
                            key={"proposal-type-id"}
                            required
                            aria-label="proposal type selection"
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
                        <Form.Group>
                            <Form.Label>Procurar por</Form.Label>
                            <Form.Select
                                required
                                aria-label="Default select example"
                                name={"search-property"}
                                defaultValue={-1}
                                //FIXME cant be keyof proposalModel either needs additional properties of pathology etc or
                                //another type of object
                                onChange={(event => setSearchProperty(event.target.value as keyof ProposalModel))}
                            >
                                <option value={"id"}>Identificador de Propostas</option>
                                <option value={"pathology"}>Patologias</option>
                                <option value={"serviceType"}>Tipo de serviço</option>
                                <option value={"therapeuticArea"}>Área terapeutica</option>
                                <option value={"state"}>Estado</option>
                                <option value={"principalInvestigator"}>Patologias</option>
                            </Form.Select>
                        </Form.Group>
                    </Stack>
                </Col>
                <Col/>
                <Col/>
                <Col>
                    <br/>
                    <Link to={`criar`} className={"btn btn-primary float-end"}>Criar Proposta</Link>
                </Col>
            </Row>
            </Container>

            <br/>
            <br/>
            <br/>
            <Container>
                {/*<Button className={"float-end"}>*/}
                {/*    {`Exportar selecionados ${checkBoxGroupState.totalCheckedItems > 0 ? `(${checkBoxGroupState.totalCheckedItems})` : ''} para Excel `}*/}
                {/*</Button>*/}
                {/*headers={getHeaders().slice(1)}*/}
                <CSVLink
                    className={"float-end mb-2"}
                    data={proposals.map(p => p.proposal)}
                    filename={`Propostas-${(new Date()).toLocaleDateString()}`}
                >
                    {`Exportar selecionados ${checkBoxGroupState.totalCheckedItems > 0 ? `(${checkBoxGroupState.totalCheckedItems})` : ''} para Excel`}
                </CSVLink>
            </Container>
            <Container>
                <Table striped bordered hover size={"sm"}>
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
                        {getHeaders().map((header, i) => <th key={`${header}-${i}`}>{header}</th>)}
                    </tr>
                    </thead>
                    <tbody>

                    {isDataReady ?
                        <>
                            {proposals.map(mapToRowElement)}
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

            <PaginationComponent/>
        </React.Fragment>
    )
}