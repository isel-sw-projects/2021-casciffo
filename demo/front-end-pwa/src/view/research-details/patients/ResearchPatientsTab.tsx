import {Button, Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {PatientModel} from "../../../model/research/ResearchModel";
import {MyTable} from "../../components/MyTable";

type RPT_Props = {
    patients: PatientModel[]
    onChangeScreenToAddPatient: () => void
    onClickToPatientDetails: (patientId: string) => void
}

export function ResearchPatientsTab(props: RPT_Props) {
    const [patients, setPatients] = useState<PatientModel[]>([])

    useEffect(() => {
        // console.log(props.patients)
        setPatients(props.patients)
    }, [props.patients])
    

    const columns = React.useMemo<ColumnDef<PatientModel>[]>(
        () => [
            {
                accessorFn: row => row.processId,
                id: 'processId',
                cell: info => <div>
                    <span>{info.getValue()}</span>
                    <br/>
                    <Button variant={"link"} onClick={() => props.onClickToPatientDetails(info.getValue())}>Ver Detalhes</Button>
                </div>,
                header: () => <span>Nº Processo</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.fullName,
                id: 'fullName',
                cell: info => info.getValue(),
                header: () => <span>Nome</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.age,
                id: 'age',
                cell: info => info.getValue(),
                header: () => <span>Idade</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.gender,
                id: 'gender',
                header: () => <span>Género</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.treatmentBranch,
                id: 'treatmentBranch',
                header: () => <span>Braço de tratamento</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.lastVisitDate,
                id: 'lastVisitDate',
                header: () => <span>Última visita</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            }],[props])

    return <Container className={"border-top border-2 border-secondary"}>
        <Container>
            <div>
                <Button variant={"outline-primary m-2 m-md-2"}>
                    Randomizar
                </Button>
            </div>
            <div>
                <Button variant={"outline-primary m-2 m-md-2"} 
                        onClick={() => props.onChangeScreenToAddPatient()}>
                    Adicionar Paciente
                </Button>
            </div>

            <MyTable data={patients} columns={columns}/>
        </Container>
    </Container>
}