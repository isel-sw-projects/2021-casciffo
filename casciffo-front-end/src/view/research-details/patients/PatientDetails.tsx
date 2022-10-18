import {PatientModel, ResearchTeamFinanceEntries, ResearchVisitModel} from "../../../model/research/ResearchModel";
import {Breadcrumb, Button, Container, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {FormInputHelper} from "../../components/FormInputHelper";
import {Link, useLocation, useParams} from "react-router-dom";
import {MyUtil} from "../../../common/MyUtil";
import {useErrorHandler} from "react-error-boundary";
import {MyError} from "../../error-view/MyError";
import {ColumnDef} from "@tanstack/react-table";
import {VisitTypes} from "../../../common/Constants";
import {MyTable} from "../../components/MyTable";

type Props = {
    fetchPatient: (researchId: string, patientId: string) => Promise<PatientModel>
    visits: ResearchVisitModel[]
    renderVisitDetails: () => void
    onRenderOverviewClick: () => void
}

export function PatientDetails(props: Props) {
    const {researchId} = useParams()
    const {hash} = useLocation()
    const errorHandler = useErrorHandler()
    const [patientProcessNum, setPatientProcessNum] = useState("")
    const [patient, setPatient] = useState<PatientModel>({})
    const [dataReady, setDataReady] = useState(false)

    useEffect(() => {
        document.title = MyUtil.RESEARCH_PATIENT_DETAILS_TITLE(researchId!, patientProcessNum)
    }, [researchId, patientProcessNum])

    useEffect(() => {
        console.log(`PATIENT DETAILS READING HASH ${hash}`)
        const regExp = new RegExp(/(pId=[0-9]*)/, "gm")
        if (!regExp.test(hash)) {
            errorHandler(new MyError("Página do paciente não existe", 404))
        }
        try {
            const params = hash.substring(1).split("&")
            const pId = params.find(p => p.matchAll(regExp))!.split("=")[1]
            setPatientProcessNum(pId)

            props.fetchPatient(researchId!, pId)
                .then(setPatient)
                .then(_ => setDataReady(true))
                .catch(errorHandler)
        } catch (e: unknown) {
            errorHandler(e)
        }
    }, [errorHandler, hash, props, researchId])

    const columns = React.useMemo<ColumnDef<ResearchVisitModel>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                cell: info => <div>
                    {info.getValue() as string}
                    <br/>
                    <Link to={`#vId=${info.getValue()}`} onClick={props.renderVisitDetails}>Ver Detalhes</Link>
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
        ],[props.renderVisitDetails])

    return <React.Fragment>
        <Container className={"border-top border-2 border-secondary"}>
            <Breadcrumb className={"m-2 m-md-2 flex"}>
                <Breadcrumb.Item className={"font-bold"} onClick={props.onRenderOverviewClick}>Pacientes</Breadcrumb.Item>
                <Breadcrumb.Item className={"font-bold"} active>Detalhes</Breadcrumb.Item>
            </Breadcrumb>
        </Container>

        <Container className={"flex border-start border-2 border-secondary justify-content-start mb-4"}>
            <Form style={{width:"40%"}}>
              <FormInputHelper label={"Nº Processo"} value={patient.processId}/>
              <FormInputHelper label={"Nome"} value={patient.fullName}/>
              <FormInputHelper label={"Idade"} value={patient.age}/>
              <FormInputHelper label={"Género"} value={patient.gender}/>
              <FormInputHelper label={"Braço de tratamento"} value={patient.treatmentBranch}/>
              <FormInputHelper label={"Data de entrada"} value={patient.joinDate ? MyUtil.formatDate(patient.joinDate, true) : "???"}/>
              <FormInputHelper label={"Última visita"} value={patient.lastVisitDate ? MyUtil.formatDate(patient.lastVisitDate, true) : "Ainda não realizou nenhuma visita"}/>
            </Form>
        </Container>

        <Container className={"flex border-start border-2 border-secondary justify-content-evenly"}>
            <MyTable data={props.visits.filter(v => v.patient!.processId === patient.processId)} columns={columns}/>
        </Container>
    </React.Fragment>
}