import React, {useEffect, useState} from "react";
import {MyUtil} from "../../common/MyUtil";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ProposalStats, ResearchStats, StatisticsService} from "../../services/StatisticsService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {useErrorHandler} from "react-error-boundary";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {ResearchAggregateModel} from "../../model/research/ResearchModel";
import {TimelineEventModel} from "../../model/proposal/TimelineEventModel";
import {ResearchTypes} from "../../common/Constants";
import {MyTable} from "../components/MyTable";
import {ColumnDef} from "@tanstack/react-table";
import {useNavigate} from "react-router-dom";
import {STATES} from "../../model/state/STATES";


type DashboardProps = {
    statisticsService: StatisticsService
}

export function Dashboard(props: DashboardProps) {
    document.title = MyUtil.DASHBOARD_TITLE

    ChartJS.register(ArcElement, Tooltip, Legend);

    const [proposalTrialStats, setProposalTrialStats] = useState<ProposalStats>({
        numberOfConcluded: 0, numberOfSubmitted: 0, researchType: "", totalCount: 0, hasData: false
    })
    const [researchTrialStats, setResearchTrialStats] = useState<ResearchStats>({
        numberOfActive: 0, numberOfCanceled: 0, numberOfCompleted: 0, researchType: "", totalCount: 0, hasData: false
    })

    const [proposalStudyStats, setProposalStudyStats] = useState<ProposalStats>({
        numberOfConcluded: 0, numberOfSubmitted: 0, researchType: "", totalCount: 0, hasData: false
    })
    const [researchStudyStats, setResearchStudyStats] = useState<ResearchStats>({
        numberOfActive: 0, numberOfCanceled: 0, numberOfCompleted: 0, researchType: "", totalCount: 0, hasData: false
    })

    const [latestProposals, setLatestProposals] = useState<ProposalModel[]>([])
    const [latestResearch, setLatestResearch] = useState<ResearchAggregateModel[]>([])
    const [nearestEvents, setNearestEvents] = useState<TimelineEventModel[]>([])
    const navigate = useNavigate()
    const errorHandler = useErrorHandler()

    useEffect(() => {
        props.statisticsService
            .getThisWeeksEvents("WEEK")
            .then(setNearestEvents)
            .catch(errorHandler)
    }, [props.statisticsService, errorHandler])

    useEffect(() => {
        props.statisticsService
            .getLastFiveUpdateProposal()
            .then(setLatestProposals)
            .catch(errorHandler)
    }, [props.statisticsService, errorHandler])

    useEffect(() => {
        props.statisticsService
            .getLastFiveUpdatedResearch()
            .then(setLatestResearch)
            .catch(errorHandler)
    }, [props.statisticsService, errorHandler])

    useEffect(() => {
        props.statisticsService
            .getProposalStats()
            .then(value => {
                const trials = value.find(s => s.researchType === ResearchTypes.CLINICAL_TRIAL.id)
                const studies = value.find(s => s.researchType === ResearchTypes.OBSVERTIONAL_STUDY.id)
                if(trials) setProposalTrialStats({...trials, hasData: trials.totalCount !== 0})

                if(studies) {
                    setProposalStudyStats({...studies, hasData: studies.totalCount !== 0})
                }
            })
            .catch(errorHandler)
    }, [errorHandler, props.statisticsService])

    useEffect(() => {
        props.statisticsService
            .getResearchStats()
            .then(value => {
                const trials = value.find(s => s.researchType === ResearchTypes.CLINICAL_TRIAL.id)
                const studies = value.find(s => s.researchType === ResearchTypes.OBSVERTIONAL_STUDY.id)
                if(trials) setResearchTrialStats({...trials, hasData: trials.totalCount !== 0})
                if(studies) setResearchStudyStats({...studies, hasData: studies.totalCount !== 0})
            })
            .catch(errorHandler)
    }, [errorHandler, props.statisticsService])

    const researchTrialStatsDonutData = React.useMemo(() => ({
        labels: ['Ensaios Completos', 'Ensaios Ativos', 'Ensaios Cancelados'],
        datasets: [
            {
                label: 'Nº Ensasios clínicos existentes',
                data: [
                    researchTrialStats.numberOfCompleted,
                    researchTrialStats.numberOfActive,
                    researchTrialStats.numberOfCanceled
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 2
            },
        ],
        legend: "Abc"
    }), [researchTrialStats])

    const researchStudyStatsDonutData = React.useMemo(() => ({
        labels: ['Estudos Completos', 'Estudos Ativos', 'Estudos Cancelados'],
        datasets: [
            {
                label: 'Nº Estudos observacionais existente',
                data: [
                    researchStudyStats.numberOfCompleted,
                    researchStudyStats.numberOfActive,
                    researchStudyStats.numberOfCanceled
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 2
            },
        ],
    }), [researchStudyStats])

    const proposalTrialStatsDonutData = React.useMemo(() => ({
        labels: ['Propostas Validadas', 'Propostas Submetidas', 'Propostas em validação'],
        datasets: [
            {
                label: 'Nº Propostas de ensaios clínicos existente.',
                data: [
                    proposalTrialStats.numberOfConcluded,
                    proposalTrialStats.numberOfSubmitted,
                    proposalTrialStats.totalCount - proposalTrialStats.numberOfConcluded - proposalTrialStats.numberOfSubmitted,
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 2
            },
        ],
    }), [proposalTrialStats])

    const proposalStudyStatsDonutData = React.useMemo(() => ({
        labels: ['Propostas Validadas', 'Propostas Submetidas', 'Propostas em validação'],
        datasets: [
            {
                label: 'Nº Propostas de estudos observacionais existente.',
                data: [
                    proposalStudyStats.numberOfConcluded,
                    proposalStudyStats.numberOfSubmitted,
                    proposalStudyStats.totalCount - proposalStudyStats.numberOfConcluded - proposalStudyStats.numberOfSubmitted,
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 2
            },
        ],
    }), [proposalStudyStats])


    const proposalColumns = React.useMemo<ColumnDef<ProposalModel>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                header: () => <span>Id</span>,
                cell: info => <Button variant={"link"} onClick={() => navigate(`propostas/${info.getValue()}`)}>{`${info.getValue()}`}</Button>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.sigla,
                id: 'sigla',
                header: () => <span>Sigla</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.serviceType!.name,
                id: 'serviceTypename',
                header: () => <span>Serviço</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.state!.name,
                id: 'stateName',
                header: () => <span>Estado</span>,
                cell: info => STATES[info.getValue() as keyof typeof STATES].name,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => MyUtil.formatDate(row.lastModified!),
                id: 'lastModified',
                cell: info => info.getValue(),
                header: () => <span>Atualizado a</span>,
                footer: props => props.column.id,}
        ], [navigate])

    const researchColumns = React.useMemo<ColumnDef<ResearchAggregateModel>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                header: () => <span>Id</span>,
                cell: info => <Button variant={"link"} onClick={() => navigate(`ensaios/${info.getValue()}`)}>{`${info.getValue()}`}</Button>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.sigla,
                id: 'sigla',
                header: () => <span>Sigla</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.cro,
                id: 'cro',
                header: () => <span>CRO</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.eudra_ct,
                id: 'eudra_ct',
                header: () => <span>Eudra CT</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => MyUtil.formatDate(row.lastModified!),
                id: 'lastModified',
                header: () => <span>Atualizado a</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
        ], [navigate])



    const eventColumns = React.useMemo<ColumnDef<TimelineEventModel>[]>(
        () => [
            {
                accessorFn: row => row.eventName,
                id: 'eventName',
                header: () => <span>Título</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.completedDate == null ? "" : MyUtil.formatDate(row.completedDate),
                id: 'completedDate',
                header: () => <span>Data de conclusão</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => MyUtil.formatDate(row.deadlineDate!),
                id: 'deadlineDate',
                cell: info => info.getValue(),
                header: () => <span>Data limite</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.proposalId,
                id: 'proposalId',
                cell: info => <Button variant={"link"} onClick={() => navigate(`/propostas/${info.getValue()}#t=chronology`)}>Ver proposta</Button>,
                header: () => <span>Ir para proposta</span>,
                footer: props => props.column.id,
            }
        ], [navigate])

    return <React.Fragment>
        <Container>
            <Row>
                <Col>
                    <Container className={"text-center font-bold"}>
                        <h4>Ensaios clínicos</h4>
                    </Container>
                </Col>
                <Col>
                    <Container className={"text-center font-bold"}>
                        <h4>Propostas</h4>
                    </Container>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Container className={"text-center"}>
                        <h5 className={"font-bold"}>Ensaios clínicos</h5>
                    </Container>
                    <Doughnut data={researchTrialStatsDonutData} options={{maintainAspectRatio: true, responsive: true}}/>
                    { !researchTrialStats.hasData &&
                        <Container className={"text-center"}>
                            Sem dados para demonstrar.
                        </Container>
                    }
                </Col>
                <Col>
                    <Container className={"text-center"}>
                        <h5 className={"font-bold"}>Ensaios observacionais</h5>
                    </Container>
                    <Doughnut data={researchStudyStatsDonutData} options={{maintainAspectRatio: true, responsive: true}}/>
                    { !researchStudyStats.hasData &&
                        <Container className={"text-center"}>
                            Sem dados para demonstrar.
                        </Container>
                    }
                </Col>
                <Col>
                    <Container className={"text-center"}>
                        <h5 className={"font-bold"}>Ensaios clínicos</h5>
                    </Container>
                    <Doughnut data={proposalTrialStatsDonutData} options={{maintainAspectRatio: true, responsive: true}}/>
                    { !proposalTrialStats.hasData &&
                        <Container className={"text-center"}>
                            Sem dados para demonstrar.
                        </Container>
                    }
                </Col>
                <Col>
                    <Container className={"text-center"}>
                        <h5 className={"font-bold"}>Estudos observacionais</h5>
                    </Container>
                    <Doughnut data={proposalStudyStatsDonutData} options={{maintainAspectRatio: true, responsive: true}}/>
                    { !proposalStudyStats.hasData &&
                        <Container className={"text-center"}>
                            Sem dados para demonstrar.
                        </Container>
                    }
                </Col>
            </Row>
        </Container>
        <Container className={"mt-2 border-top border-secondary border-2"}>
            <Row className={"mt-3"}>
                <Col>
                    <Container className={"text-center"}>
                        <h5>Últimos 5 ensaios atualizados.</h5>
                    </Container>
                        <MyTable data={latestResearch} columns={researchColumns}/>
                </Col>
                <Col>
                    <Container className={"text-center"}>
                        <h5>Últimas 5 propostas atualizadas.</h5>
                    </Container>
                        <MyTable data={latestProposals.sort((a,b) => MyUtil.cmp(b.lastModified, a.lastModified))} columns={proposalColumns}/>
                </Col>
            </Row>
        </Container>

        <Container>
            <h5>Eventos esta semana.</h5>
            <MyTable data={nearestEvents} columns={eventColumns}/>
        </Container>

    </React.Fragment>;
}