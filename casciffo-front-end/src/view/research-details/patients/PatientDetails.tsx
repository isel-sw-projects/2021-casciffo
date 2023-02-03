import {
    ResearchPatientModel,
    ResearchVisitModel
} from "../../../model/research/ResearchModel";
import {Breadcrumb, Button, Col, Container, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {FormInputHelper} from "../../components/FormInputHelper";
import { useParams} from "react-router-dom";
import {MyUtil} from "../../../common/MyUtil";
import {useErrorHandler} from "react-error-boundary";
import {MyError} from "../../error-view/MyError";
import {ColumnDef} from "@tanstack/react-table";
import {PATIENT_ID_PARAMETER, VisitTypes} from "../../../common/Constants";
import {MyTable} from "../../components/MyTable";
import { Row } from "react-bootstrap";

type Props = {
    fetchPatient: (researchId: string, patientId: string) => Promise<ResearchPatientModel>
    visits: ResearchVisitModel[]
    renderVisitDetails: (vId: string) => void
    onRenderOverviewClick: () => void
}

export function PatientDetails(props: Props) {
    const {researchId} = useParams()
    const errorHandler = useErrorHandler()
    const [patientProcessNum, setPatientProcessNum] = useState("")
    const [patient, setPatient] = useState<ResearchPatientModel>({})
    const [dataReady, setDataReady] = useState(false)

    useEffect(() => {
        document.title = MyUtil.RESEARCH_PATIENT_DETAILS_TITLE(researchId!, patientProcessNum)
    }, [researchId, patientProcessNum])

    useEffect(() => {
        const hash = window.location.hash
        // console.log(`PATIENT DETAILS READING HASH ${hash}`)

        const params = MyUtil.parseUrlHash(hash).find(params => params.key === PATIENT_ID_PARAMETER)
        if(params == null) {
            errorHandler(new MyError("Página do paciente não existe", 404))
            return
        }
        const pId = params.value
        setPatientProcessNum(pId)

        props.fetchPatient(researchId!, pId)
            .then(setPatient)
            .then(_ => setDataReady(true))
            .catch(errorHandler)

    }, [errorHandler, props, researchId])

    const columns = React.useMemo<ColumnDef<ResearchVisitModel>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                cell: info => <div>
                    {info.getValue() as string}
                    <br/>
                    <Button variant={"link"} onClick={() => props.renderVisitDetails(`${info.getValue()}`)}>Ver Detalhes</Button>
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

    return <React.Fragment>
        <Container className={"border-top border-2 border-secondary"}>
            <Breadcrumb className={"m-2 m-md-2 flex"}>
                <Breadcrumb.Item className={"font-bold"} onClick={props.onRenderOverviewClick}>Pacientes</Breadcrumb.Item>
                <Breadcrumb.Item className={"font-bold"} active>Detalhes</Breadcrumb.Item>
            </Breadcrumb>
        </Container>

        <Container className={"flex border-bottom border-2 border-secondary justify-content-start mb-4"}>
            {
                dataReady
                    ? <Form>
                        <Row>
                            <FormInputHelper label={"Nº Processo"} value={patient.patient!.processId}/>
                            <FormInputHelper label={"Nome"} value={patient.patient!.fullName}/>
                            <FormInputHelper label={"Idade"} value={patient.patient!.age}/>
                        </Row>
                        <Row>
                            <FormInputHelper label={"Género"} value={patient.patient!.gender}/>
                            <FormInputHelper label={"Braço de tratamento"} value={patient.treatmentBranch}/>
                            <FormInputHelper label={"Data de entrada"}
                                             value={patient.joinDate
                                                 ? MyUtil.formatDate(patient.joinDate, true)
                                                 : "N/A"}/>
                        </Row>
                    <Row>
                            <FormInputHelper label={"Última visita"}
                                             value={patient.lastVisitDate
                                                 ? MyUtil.formatDate(patient.lastVisitDate, true)
                                                 : "Sem histórico de visitas."}/>
                        <Col/>
                        <Col/>
                    </Row>
                    </Form>
                    : <span className={"text-info"}>A carregar dados...</span>
            }
        </Container>

        <Container className={"flex justify-content-evenly"}>
            { dataReady &&
                <MyTable data={props.visits.filter(v => v.researchPatient!.patient!.processId === patient.patient!.processId)} columns={columns}/>
            }
        </Container>
    </React.Fragment>
}