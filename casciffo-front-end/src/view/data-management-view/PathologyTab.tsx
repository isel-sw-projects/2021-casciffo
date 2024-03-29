
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {PathologyModel} from "../../model/proposal-constants/PathologyModel";
import {SearchBar} from "../components/SearchBar";
import {MyTable} from "../components/MyTable";
import React, {useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {IconButton, Tooltip} from "@mui/material";
import {RiDeleteBin6Fill} from "react-icons/ri";
import {FaEdit} from "react-icons/fa";
import {AiFillSave} from "react-icons/ai";
import {ImCancelCircle} from "react-icons/im";
import {FloatingLabelHelper} from "../components/FloatingLabelHelper";


type Props = {
    pathologies: PathologyModel[]
    savePathology: (pathology: PathologyModel) => void
    updatePathology: (pathology: PathologyModel) => void
    deletePathology: (pathologyId: number) => void
}

type CheckRow = {
    name?: string,
    id?: number,
    isEdit: boolean
}

export function PathologyTab(props: Props) {

    const [query, setQuery] = useState("")
    const [showEntryForm, setShowEntryForm] = useState(false)
    const [newEntry, setNewEntry] = useState<PathologyModel>({})
    const [data, setData] = useState<CheckRow[]>([])

    useEffect(() => {
        const mappedData = props.pathologies.map(p => ({...p, isEdit: false}))
        setData(mappedData)
    }, [props.pathologies])

    const handleSearchSubmit = (q: string) => {
        setQuery(q)
    }

    const filterData = () => {
        const regExp = new RegExp(`${query}.*`, "gi")
        return data
            .filter(p => query === "" || regExp.test(p.name!))
    }

    const handleNewEntry = (e: any) => {
        e.preventDefault()
        e.stopPropagation()

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
                    header: () => "Patologia",
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.isEdit ?
                        <Container className={"flex-row"}>
                            <div className={"float-start"}>
                                <Tooltip title={"Guardar"} placement={"top"} arrow>
                                    <IconButton aria-label={"guardar"} onClick={() => props.updatePathology(row)}>
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
                            <div className={"float-end"} onClick={() => props.deletePathology(row.id!)}>
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
                    {showEntryForm ?
                        <Form
                            style={{width: "40%"}}
                            onSubmit={handleNewEntry}>
                            <fieldset className={"border p-3 border-secondary"}>
                                <legend className={"float-none w-auto p-2"}>Nova Patologia</legend>
                                <FloatingLabelHelper
                                    required
                                    onChange={e => setNewEntry({name: e.target.value})}
                                    value={newEntry.name}
                                    label={"Patologia"}
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
                        : <Button onClick={() => setShowEntryForm(true)}>Adicionar nova Patologia</Button>}
                </Col>
            </Row>
        </Container>
        <Container className={"mt-5"}>

            <Row>
                <Col>
                    <SearchBar handleSubmit={handleSearchSubmit}/>
                </Col>
                <Col/>
                <Col/>
            </Row>
        </Container>

        <Container className={"mt-4"}>
            <MyTable
                pagination
                data={filterData()}
                columns={columns}
            />
        </Container>
    </Container>
}