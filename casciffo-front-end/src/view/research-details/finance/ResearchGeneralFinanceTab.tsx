import React, {useEffect, useState} from "react";
import {ResearchFinanceEntries} from "../../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";
import {MyTable} from "../../components/MyTable";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {FloatingLabelHelper} from "../../components/FloatingLabelHelper";

type MyProps = {
    entries: ResearchFinanceEntries[]
}


export function ResearchGeneralFinanceTab(props: MyProps) {

    const [entries, setEntries] = useState<ResearchFinanceEntries[]>([])

    useEffect(() => {
        setEntries(props.entries)
    }, [props.entries])

    const columns = React.useMemo<ColumnDef<ResearchFinanceEntries>[]>(
        () => [
            {
                accessorFn: row => row.researchFinanceId,
                id: 'researchFinanceId',
                cell: info => <div>
                    <span>{info.getValue() as string}</span>
                </div>,
                header: () => <span>Identificador</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.transactionDate,
                id: 'transactionDate',
                header: () => <span>Data de transação</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.typeOfFlow,
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
            }],[])

    const [query, setQuery] = useState("")
    //TODO faz sentido poder procurar por membro de equipa / responsavel / datas e tipo de movimento
    const [searchProperty, setSearchProperty] = useState("")

    const [showEntryForm, setShowEntryForm] = useState(false)

    const toggleEntryForm = () => setShowEntryForm(prevState => !prevState)

    const handleNewEntry = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        //SAVE ENTRY
        //UPDATE TABLE IS DONE IN UPPER COMPONENTS
    }

    return <React.Fragment>

        <Container>


            <Button className={"flex float-end mb-2 mt-2 mb-md-2 mt-md-2"} variant={"outline-primary"}
                    onClick={toggleEntryForm}>{"Nova entrada"}</Button>

        </Container>

        <Container>
            {
                showEntryForm &&
                <Form onSubmit={handleNewEntry}>
                    <fieldset>
                        <legend></legend>
                        <Row>
                            <Col>
                                <FloatingLabelHelper label={"Data de transação"} name={"Data de transação"}/>
                            </Col>
                            <Col>
                                <FloatingLabelHelper label={"Tipo de movimento"} name={"Tipo de movimento"}/>
                            </Col>
                            <Col>
                                <FloatingLabelHelper label={"Motivo"} name={"Motivo"}/>
                            </Col>
                            <Col>
                                <FloatingLabelHelper label={"Quantia"} name={"Quantia"}/>
                            </Col>
                        </Row>
                    </fieldset>
                </Form>
            }
        </Container>

        <MyTable data={entries} columns={columns}/>
    </React.Fragment>
}