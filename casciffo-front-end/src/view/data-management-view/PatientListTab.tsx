import {PatientService} from "../../services/PatientService";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {SearchComponent} from "../components/SearchComponent";
import {FloatingLabelHelper} from "../components/FloatingLabelHelper";
import {MyTable} from "../components/MyTable";
import {ColumnDef} from "@tanstack/react-table";
import {IconButton, Tooltip} from "@mui/material";
import {RiDeleteBin6Fill} from "react-icons/ri";
import {PatientModel} from "../../model/research/ResearchModel";
import {RequiredLabel} from "../components/RequiredLabel";
import {MyError} from "../error-view/MyError";
import {HiMagnifyingGlassPlus} from "react-icons/hi2";

type Props = {
    service: PatientService
    errorToast: (err: MyError) => void
}

export function PatientListTab(props: Props) {

    const [query, setQuery] = useState("")
    const [showEntryForm, setShowEntryForm] = useState(false)
    const [newEntry, setNewEntry] = useState<PatientModel>({})
    const [data, setData] = useState<PatientModel[]>([])

    useEffect(() => {
        props.service
            .fetchPatients()
            .then(setData)
    }, [props.service])

    const handleSearchSubmit = (q: string) => {
        setQuery(q)
    }

    const filterData = () => {
        const regExp = new RegExp(`${query}.*`, "gi")
        return data
            .filter(p => query === "" || regExp.test(p.fullName!) || regExp.test(p.processId!))
    }

    const handleNewEntry = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        props.service
            .savePatient(newEntry)
            .then(p => {
                setData(prevState => ([p, ...prevState]))
            })
            .catch(props.errorToast)
        resetAndHideForm()
    }

    const resetAndHideForm = () => {
        setShowEntryForm(false)
        setNewEntry({
            id: "",
            processId: "",
            fullName: "",
            gender: "",
            age: ""
        })
    }

    const updateNewEntry = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const key = e.target.name
        const val = e.target.value
        setNewEntry(prevState => ({
            ...prevState,
            [key]: val
        }))
    }


    const deletePatient = useCallback((patientId: string) => {
        props.service
            .deletePatient(patientId)
            .then(_ => {
                setData(prevState => prevState.filter(p => p.id !== patientId))
            })
            .catch(props.errorToast)
    }, [props])


    const columns = React.useMemo<ColumnDef<PatientModel>[]>(
        () =>
        {
            const goToPatientDetails = (patientId: string) => {
                props.errorToast(new MyError("Vem na próxima iteração de CASCIFFOOOOOOOOO"))
            }
            return [
                {
                    accessorFn: row => row.processId,
                    id: 'processId',
                    cell: info => info.getValue(),
                    header: () => <span>Nº Processo</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.fullName,
                    id: 'name',
                    header: () => "Nome",
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.gender,
                    id: 'gender',
                    header: () => "Género",
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.age,
                    id: 'age',
                    header: () => "Idade",
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row =>
                        <Container>
                            <div className={"float-start"}>
                                <Tooltip title={"Ver detalhes"} placement={"top"} arrow>
                                    <IconButton aria-label={"detalhes de paciente"} onClick={() => goToPatientDetails(row.id!)}>
                                        <HiMagnifyingGlassPlus style={{color: "#3b4ba4"}}/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className={"float-end"} onClick={() => deletePatient(row.id!)}>
                                <Tooltip title={"Apagar"} placement={"top"} arrow>
                                    <IconButton aria-label={"apagar"}>
                                        <RiDeleteBin6Fill style={{color: "red"}}/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Container>,
                    id: 'actions-buttons',
                    header: () => <div className={"text-center"}>Ações</div>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                }
            ]
        },[props, deletePatient])

    return <Container>
        <Container className={"mt-5"}>

            <Row>
                <Col>
                    <SearchComponent handleSubmit={handleSearchSubmit}/>
                </Col>
                <Col/>
                <Col/>
            </Row>
        </Container>
        <Container className={"mt-5"}>
            <Row>
                <Col>
                    {showEntryForm ?
                        <Form
                            className={"m-2 m-md-2"}
                            style={{width:"40%"}}
                            onSubmit={handleNewEntry}>
                            <fieldset className={"border border-secondary p-3"}>
                                <legend className={"float-none w-auto p-2"}>Dados do paciente</legend>


                                <FloatingLabelHelper
                                    required
                                    label={"Nº Processo"}
                                    name={"processId"}
                                    type={"number"}
                                    value={newEntry.processId}
                                    onChange={updateNewEntry}
                                />
                                <FloatingLabelHelper
                                    required
                                    label={"Nome completo"}
                                    name={"fullName"}
                                    value={newEntry.fullName}
                                    onChange={updateNewEntry}
                                />
                                <FloatingLabelHelper
                                    required
                                    label={"Idade"}
                                    name={"age"}
                                    type={"number"}
                                    value={newEntry.age}
                                    onChange={updateNewEntry}
                                />

                                <Form.Group className={"m-2"}>
                                    <RequiredLabel label={"Género"}/>
                                    <Form.Select
                                        key={"gender-id"}
                                        required
                                        aria-label="gender select"
                                        name={"gender"}
                                        defaultValue={""}
                                        onChange={updateNewEntry}
                                    >
                                        <option key={"op-invalid"} value={""} disabled>-Género-</option>
                                        <option key={`op-M`} value={"M"}>M</option>
                                        <option key={`op-F`} value={"F"}>F</option>
                                    </Form.Select>
                                </Form.Group>
                                <div>
                                    <div className={"float-start"}>
                                        <Button type={"submit"} variant={"outline-success"}>Guardar</Button>
                                    </div>
                                    <div className={"float-end"}>
                                        <Button onClick={resetAndHideForm} variant={"outline-danger"}>Cancelar</Button>
                                    </div>
                                </div>
                            </fieldset>
                        </Form>
                        : <Button onClick={() => setShowEntryForm(true)}>Adicionar novo Paciente</Button>}
                </Col>
            </Row>
        </Container>

        <Container className={"mt-5"}>
            <MyTable
                pagination
                data={filterData()}
                columns={columns}
            />
        </Container>
    </Container>
}
