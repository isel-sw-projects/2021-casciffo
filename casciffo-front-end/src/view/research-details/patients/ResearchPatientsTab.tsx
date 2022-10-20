import {Button, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {ResearchPatientModel} from "../../../model/research/ResearchModel";
import {MyTable} from "../../components/MyTable";

type RPT_Props = {
    patients: ResearchPatientModel[]
    treatmentBranches: string[]
    onChangeScreenToAddPatient: () => void
    onClickToPatientDetails: (patientId: string) => void
    saveRandomization: (patients: ResearchPatientModel[]) => void
}

export function ResearchPatientsTab(props: RPT_Props) {
    const [patients, setPatients] = useState<ResearchPatientModel[]>([])

    useEffect(() => {
        // console.log(props.patients)
        setPatients(props.patients)
    }, [props.patients])
    

    const columns = React.useMemo<ColumnDef<ResearchPatientModel>[]>(
        () => [
            {
                accessorFn: row => row.patient!.processId,
                id: 'processId',
                cell: info => <div className={"text-start"}>
                    <span className={"ms-3 ms-md-3"}>{`${info.getValue()}`}</span>
                    <br/>
                    <Button variant={"link"} onClick={() => props.onClickToPatientDetails(`${info.getValue()}`)}>Ver Detalhes</Button>
                </div>,
                header: () => <span>Nº Processo</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.patient!.fullName,
                id: 'fullName',
                cell: info => info.getValue(),
                header: () => <span>Nome</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.patient!.age,
                id: 'age',
                cell: info => info.getValue(),
                header: () => <span>Idade</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.patient!.gender,
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

    const randomizeTreatmentBranches = () => {
        setRandomized(true)
        setPatients(prevState => 
            prevState
                .map(p => {
                    p.treatmentBranch = props.treatmentBranches[Math.floor(Math.random()*props.treatmentBranches.length)]
                    return p
                }))
    }
    
    const [randomized, setRandomized] = useState(false)
    
    const saveRandomize = useCallback(() => {
        setRandomized(false)
        props.saveRandomization(patients)
    }, [patients, props])

    return <Container className={"border-top border-2 border-secondary"}>
        <Container>
            <Row>
                <Col>

                    <div>
                        <Button variant={"outline-primary m-2 m-md-2"} onClick={randomizeTreatmentBranches}>
                            Randomizar
                        </Button>
                    </div>
                    { randomized &&
                        <div>
                            <Button variant={"outline-success m-2 m-md-2"} onClick={saveRandomize}>
                                Guardar randomização
                            </Button>
                        </div>
                    }
                </Col>
                <Col>
                    <div>
                        <Button variant={"outline-primary m-2 m-md-2"}
                                onClick={() => props.onChangeScreenToAddPatient()}>
                            Adicionar Paciente
                        </Button>
                    </div>
                </Col>
                <Col/>
                <Col>
                    <h5>Braços de tratamento</h5>
                    <ListGroup className={"mb-2"} style={{overflow: "auto"}}>
                        {props.treatmentBranches.length > 0
                            ? props.treatmentBranches?.map((b, i) =>
                                <ListGroupItem
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                    key={`${b}-${i}}`}
                                    style={{backgroundColor: (i & 1) === 1 ? "whitesmoke" : "white"}}
                                >{b}</ListGroupItem>)
                            : "Nenhum definido"}
                    </ListGroup>
                </Col>
                <Col>
                </Col>
            </Row>

            <MyTable data={patients} columns={columns}/>
        </Container>
    </Container>
}