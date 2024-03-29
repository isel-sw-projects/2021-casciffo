import React, {useEffect, useState} from "react";
import {ResearchFinanceEntry} from "../../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";
import {MyTable} from "../../components/MyTable";
import {Button, Container, Form, Stack} from "react-bootstrap";
import {FloatingLabelHelper} from "../../components/FloatingLabelHelper";
import {TypeOfMonetaryFlows} from "../../../common/Constants";

type MyProps = {
    entries: ResearchFinanceEntry[]
    onNewEntry: (entry: ResearchFinanceEntry) => void
    canShowForm: boolean
}


export function ResearchFinanceEntriesTab(props: MyProps) {

    const [entries, setEntries] = useState<ResearchFinanceEntry[]>([])

    useEffect(() => {
        setEntries(props.entries)
    }, [props.entries])

    const columns = React.useMemo<ColumnDef<ResearchFinanceEntry>[]>(
        () => [
            {
                accessorFn: row => row.transactionDate,
                id: 'transactionDate',
                header: () => <span>Data de transação</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => Object.values(TypeOfMonetaryFlows).find(tf => tf.id === row.typeOfMonetaryFlow)!.name,
                id: 'typeOfFlow',
                header: () => <span>Tipo de movimento</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.motive,
                id: 'motive',
                cell: info => info.getValue(),
                header: () => <span>Motivo</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.amount,
                id: 'amount',
                cell: info => info.getValue(),
                header: () => <span>Quantia</span>,
                footer: props => props.column.id,
            },
        ], [])

    // const [query, setQuery] = useState("")
    // //TODO faz sentido poder procurar por membro de equipa / responsavel / datas e tipo de movimento
    // const [searchProperty, setSearchProperty] = useState("")

    const [showEntryForm, setShowEntryForm] = useState(false)

    const toggleEntryForm = () => setShowEntryForm(prevState => !prevState)

    const freshEntry = (): ResearchFinanceEntry => ({
        transactionDate: "",
        typeOfMonetaryFlow: "",
        motive: "",
        amount: "",
    })

    const resetEntryForm = () => {
        toggleEntryForm()
        setNewEntry(freshEntry())
    }

    const [newEntry, setNewEntry] = useState<ResearchFinanceEntry>(freshEntry())

    const updateNewEntry = (e: any) => {
        const key = e.target.name as keyof ResearchFinanceEntry
        const value = e.target.value
        setNewEntry(prevState => ({...prevState, [key]: value}))
    }

    const handleNewEntry = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        props.onNewEntry(newEntry)
        resetEntryForm()
    }


    return <React.Fragment>

        <Container>


            {
                !showEntryForm && props.canShowForm &&
                <Button className={"block float-start mb-2 mt-2 mb-md-2 mt-md-2"} variant={"outline-primary"}
                        onClick={toggleEntryForm}>Nova entrada</Button>
            }

        </Container>

        <Container>
            {
                showEntryForm &&
                <Form
                    style={{width: "40%"}}
                    onSubmit={handleNewEntry}>
                    <fieldset className={"border p-3 border-secondary"}>
                        <legend className={"float-none w-auto p-2"}>Nova entrada</legend>
                        <Form.Group className={"m-2"}>
                            <Stack direction={"horizontal"} gap={2}>
                                <Form.Label className={"font-bold"}>Data de transação</Form.Label>
                                <Form.Control
                                    className={"font-bold"}
                                    required
                                    type={"date"}
                                    name={"transactionDate"}
                                    onChange={updateNewEntry}
                                    value={newEntry.transactionDate}
                                />
                            </Stack>
                        </Form.Group>
                        <Form.Group className={"m-2"}>
                            <Form.Select
                                className={"text-center"}
                                key={"type-of-monetary-flow"}
                                required
                                aria-label="Seleção de tipo de movimento."
                                name={"typeOfMonetaryFlow"}
                                defaultValue={""}
                                onChange={updateNewEntry}
                            >
                                <option value={""} disabled>-Tipo de transação-</option>
                                {
                                    Object.values(TypeOfMonetaryFlows)
                                        .map((tf) => <option key={tf.id} value={tf.id}>{tf.name}</option>)
                                }
                            </Form.Select>
                        </Form.Group>
                        <FloatingLabelHelper
                            label={"Motivo"}
                            name={"motive"}
                            value={newEntry.motive}
                            onChange={updateNewEntry}
                            required
                        />
                        <FloatingLabelHelper
                            label={"Quantia (€)"}
                            type={"number"}
                            name={"amount"}
                            value={newEntry.amount}
                            onChange={updateNewEntry}
                            required
                        />
                        <br/>
                        <Button variant={"outline-success float-start m-2"}
                                type={"submit"}>Adicionar</Button>
                        <Button variant={"outline-danger float-end m-2"} type={"button"}
                                onClick={resetEntryForm}>Cancelar</Button>
                    </fieldset>
                </Form>
            }
        </Container>

        <MyTable
            pagination
            data={entries}
            columns={columns}
        />
    </React.Fragment>
}