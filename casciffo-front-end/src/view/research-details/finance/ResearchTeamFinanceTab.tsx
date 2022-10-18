import React, {useEffect, useState} from "react";
import {ResearchFinanceEntries, ResearchTeamFinanceEntries} from "../../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";
import {MyTable} from "../../components/MyTable";
import {Button, Container} from "react-bootstrap";

type MyProps = {
    entries: ResearchTeamFinanceEntries[]
}

export function ResearchTeamFinanceTab(props: MyProps) {

    const [entries, setEntries] = useState<ResearchTeamFinanceEntries[]>([])

    useEffect(() => {
        setEntries(props.entries)
    }, [props.entries])

    const columns = React.useMemo<ColumnDef<ResearchTeamFinanceEntries>[]>(
        () => [
            {
                accessorFn: row => row.teamFinanceId,
                id: 'researchFinanceId',
                cell: info => <div>
                    <span>{info.getValue() as string}</span>
                </div>,
                header: () => <span>Id</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.transactionDate,
                id: 'transactionDate',
                header: () => <span>Género</span>,
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
    const [searchProperty, setSearchProperty] = useState("")

    // const filter = () => entries.filter(e => e.)

    return <React.Fragment>

        <Container className={"flex"}>
        {/*    TODO ADD SEARCH BAR   */}

            <Button className={"flex float-end mb-2 mt-2 mb-md-2 mt-md-2"} variant={"outline-primary"}>Nova entrada</Button>
        </Container>

        <MyTable data={entries} columns={columns}/>
    </React.Fragment>
}
