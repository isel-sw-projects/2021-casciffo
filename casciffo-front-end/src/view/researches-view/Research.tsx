import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import React, {useEffect, useState} from "react";
import {ResearchTypes} from "../../common/Constants";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {Util} from "../../common/Util";
import {Link} from "react-router-dom";
import {Col, Container, Form, Row, Stack, Table} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import {ResearchAggregateModel, ResearchModel} from "../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";


export function Research(props: { researchService: ResearchAggregateService }) {
    useEffect(() => {
        document.title = Util.RESEARCH_TITLE
    })

    const service = props.researchService


    const [ensaios, setEnsaios] = useState<ResearchModel[]>([])
    const [isDataReady, setIsDataReady] = useState(false)
    const [researchType, setResearchType] = useState<string>(ResearchTypes.CLINICAL_TRIAL.id)
    const [query, setQuery] = useState("")

    useEffect(() => {
        setIsDataReady(false)
        props.researchService
            .fetchByType(researchType)
            .then(setEnsaios)
            .then(() => setIsDataReady(true))
    }, [props.researchService, researchType])



    function handleResearchTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setResearchType(event.target.value)
    }


    // function getHeaders() : CSVHeader[] {
    //     return researchType === ResearchTypes.CLINICAL_TRIAL.id? tableHeadersClinicalTrials : tableHeadersClinicalStudies
    // }


    const columns = React.useMemo<ColumnDef<ResearchAggregateModel>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                cell: info => <div>
                    <span>{info.getValue()}</span>
                    <br/>
                    <Link to={`/${info.getValue()}`}>Ver Detalhes</Link>
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
                header: () => <span>'Promotor'</span>,
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
                id: 'therapeuticArea',
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


    return (
        <Container className={"m-2"}>
            <Container>
                <Form>
                    <Form.Group>
                        <Form.Label>A visualizar</Form.Label>
                        <Form.Select
                            key={"proposal-type-id"}
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
                </Form>
            </Container>

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


            {isDataReady &&
                <MyTable
                    data={ensaios}
                    columns={columns}
                />
            }

        </Container>
    )
}