import React, {useEffect, useState} from "react";
import {ResearchFinanceEntries, ResearchTeamFinanceEntries} from "../../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";
import {MyTable} from "../../components/MyTable";
import {Button, Col, Container, Form, Stack} from "react-bootstrap";
import {FloatingLabelHelper} from "../../components/FloatingLabelHelper";
import {TeamInvestigatorModel} from "../../../model/TeamInvestigatorModel";
import {TypeOfMonetaryFlows} from "../../../common/Constants";

type MyProps = {
    team: TeamInvestigatorModel[]
    entries: ResearchTeamFinanceEntries[]
    onNewEntry: (entry: ResearchTeamFinanceEntries) => void
}

export function ResearchTeamFinanceEntriesTab(props: MyProps) {

    const [entries, setEntries] = useState<ResearchTeamFinanceEntries[]>([])

    useEffect(() => {
        setEntries(props.entries)
    }, [props.entries])

    const columns = React.useMemo<ColumnDef<ResearchTeamFinanceEntries>[]>(
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
                accessorFn: row => row.responsibleForPayment,
                id: 'responsibleForPayment',
                header: () => <span>Responsável</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.amount,
                id: 'amount',
                cell: info => info.getValue(),
                header: () => <span>Quantia</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.partitionPercentage,
                id: 'partitionPercentage',
                header: () => <span>Partição %</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.roleAmount,
                id: 'roleAmount',
                header: () => <span>Encargo</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.investigator?.name,
                id: 'investigatorName',
                cell: info => info.getValue(),
                header: () => <span>Membro de equipa</span>,
                footer: props => props.column.id,
            },
            ],[])

    const [query, setQuery] = useState("")
    //TODO faz sentido poder procurar por membro de equipa / responsavel / datas e tipo de movimento
    const [searchProperty, setSearchProperty] = useState<string>("")

    // const filter = () => entries.filter(e => e.)

    const [showEntryForm, setShowEntryForm] = useState<boolean>(false)

    const handleNewEntry = () => {
        props.onNewEntry(newEntry)
        resetEntry()
    }

    const freshEntry = (): ResearchTeamFinanceEntries => ({
        typeOfMonetaryFlow: TypeOfMonetaryFlows.DEBIT.id,
        transactionDate: "",
        responsibleForPayment: "",
        amount: "",
        partitionPercentage: "",
        roleAmount: "",
        investigatorId: "",
        investigator: {},
    })
    const resetEntry = () => {
        setNewEntry(freshEntry())
        toggleEntryForm()
    }

    const [newEntry, setNewEntry] = useState<ResearchTeamFinanceEntries>(freshEntry())

    const updateNewEntry = (e: any) => {
        const key = e.target.name as keyof ResearchTeamFinanceEntries
        const value = e.target.value
        setNewEntry(prevState => ({...prevState, [key]: value}))
    }

    const handleInvestigatorSelect = (e: any) => {
        console.log(e.target.value)
        const selectedInvestigator = props.team.find(t => t.memberId === parseInt(e.target.value))!.member!
        console.log(selectedInvestigator)
        setNewEntry(prevState => ({
            ...prevState,
            investigatorId: selectedInvestigator.userId,
            investigator: selectedInvestigator
        }))
    }

    const toggleEntryForm = () => setShowEntryForm(prevState => !prevState)


    return <React.Fragment>

        <Container className={"flex"}>

            { !showEntryForm &&
                <Button className={"float-start mb-2 mt-2 mb-md-2 mt-md-2"} variant={"outline-primary"} onClick={toggleEntryForm}>Nova entrada</Button>
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
                                <br/>
                                <Form.Select
                                    key={"team-member-select"}
                                    className={"text-center"}
                                    required
                                    name={"investigator"}
                                    defaultValue={-1}
                                    onChange={handleInvestigatorSelect}
                                >
                                    <option key={"op-invalid"} value={-1} disabled><span className={"text-bold"}>(Selecionar membro de equipa)</span></option>
                                    {props.team.map(i =>
                                        <option key={`op-${i.id}`} value={i.memberId}>{i.member!.name}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
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
                            <FloatingLabelHelper
                                required
                                label={"Responsável"}
                                name={"responsibleForPayment"}
                                value={newEntry.responsibleForPayment}
                                onChange={updateNewEntry}/>
                            <FloatingLabelHelper
                                required
                                label={"Partição (%)"}
                                name={"partitionPercentage"}
                                type={"number"}
                                value={newEntry.partitionPercentage}
                                onChange={updateNewEntry}/>
                            <FloatingLabelHelper
                                required
                                label={"Valor de Encargo"}
                                name={"roleAmount"}
                                type={"number"}
                                value={newEntry.roleAmount}
                                onChange={updateNewEntry}/>
                            <FloatingLabelHelper
                                required
                                label={"Quantia"}
                                name={"amount"}
                                type={"number"}
                                value={newEntry.amount}
                                onChange={updateNewEntry}/>
                            <Button variant={"outline-danger float-start m-2"} onClick={resetEntry}>Cancelar</Button>
                            <Button variant={"outline-success float-end m-2"} type={"submit"}>Adicionar</Button>
                    </fieldset>
                </Form>
            }
        </Container>

        <MyTable data={entries} columns={columns}/>
    </React.Fragment>
}
