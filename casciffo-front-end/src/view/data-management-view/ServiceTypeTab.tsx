
import {ServiceTypeModel} from "../../model/proposal-constants/ServiceTypeModel";
import React, {useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {IconButton, Tooltip} from "@mui/material";
import {AiFillSave} from "react-icons/ai";
import {ImCancelCircle} from "react-icons/im";
import {FaEdit} from "react-icons/fa";
import {RiDeleteBin6Fill} from "react-icons/ri";
import {SearchComponent} from "../components/SearchComponent";
import {FloatingLabelHelper} from "../components/FloatingLabelHelper";
import {MyTable} from "../components/MyTable";


type Props = {
    serviceTypes: ServiceTypeModel[]
    saveServiceType: (serviceType: ServiceTypeModel) => void
    updateServiceType: (serviceType: ServiceTypeModel) => void
    deleteServiceType: (serviceTypeId: number) => void
}

type CheckRow = {
    name?: string,
    id?: number,
    isEdit: boolean
}

export function ServiceTypeTab(props: Props) {

    const [query, setQuery] = useState("")
    const [showEntryForm, setShowEntryForm] = useState(false)
    const [newEntry, setNewEntry] = useState<ServiceTypeModel>({})
    const [data, setData] = useState<CheckRow[]>([])

    useEffect(() => {
        const mappedData = props.serviceTypes.map(p => ({...p, isEdit: false}))
        setData(mappedData)
    }, [props.serviceTypes])

    const handleSearchSubmit = (q: string) => {
        setQuery(q)
    }

    const filterData = () => {
        const regExp = new RegExp(`${query}.*`, "gi")
        return data
            .filter(s => query === "" || regExp.test(s.name!))
    }

    const handleNewEntry = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        props.saveServiceType(newEntry)
        resetAndHideForm()
    }

    const resetAndHideForm = () => {
        setShowEntryForm(false)
        setNewEntry({name: ""})
    }

    const columns = React.useMemo<ColumnDef<CheckRow>[]>(
        () =>
        {
            const updateName = (row: CheckRow) => {
                setData(prevState => prevState.map(p => p.id === row.id ? row : p))
            }
            const toggleEdit = (row: CheckRow) => {
                setData(prevState => prevState.map(p => p.id === row.id ? row : p))
            }
            return [
                {
                    accessorFn: row => row.isEdit ?
                        <input type={"text"} value={row.name} onChange={event => updateName({...row, name: event.target.value})} />
                        : row.name,
                    id: 'somtimes-an-input-name',
                    header: () => "Serviços",
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.isEdit ?
                        <Container className={"flex-row"}>
                            <div className={"float-start"}>
                                <Tooltip title={"Guardar"} placement={"top"} arrow>
                                    <IconButton aria-label={"guardar"} onClick={() => props.updateServiceType(row)}>
                                        <AiFillSave style={{color: "#7bb06a"}}/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className={"float-end"} onClick={() => toggleEdit({...row, isEdit: false})}>
                                <Tooltip title={"Cancelar"} placement={"top"} arrow>
                                    <IconButton aria-label={"cancelar"}>
                                        <ImCancelCircle style={{color: "red"}}/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Container>
                        :
                        <Container>
                            <div className={"float-start"}>
                                <Tooltip title={"Editar"} placement={"top"} arrow>
                                    <IconButton aria-label={"editar"} onClick={() => toggleEdit({...row, isEdit: true})}>
                                        <FaEdit style={{color: "#3b4ba4"}}/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className={"float-end"} onClick={() => props.deleteServiceType(row.id!)}>
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
        },[props])

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
                            style={{width: "40%"}}
                            onSubmit={handleNewEntry}>
                            <fieldset className={"border p-3 border-secondary"}>
                                <legend className={"float-none w-auto p-2"}>Novo Serviço</legend>
                                <FloatingLabelHelper
                                    required
                                    onChange={e => setNewEntry({name: e.target.value})}
                                    value={newEntry.name}
                                    label={"Serviço"}
                                    name={"name"}
                                />
                                <br/>
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
                        : <Button onClick={() => setShowEntryForm(true)}>Adicionar novo Serviço</Button>}
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