import React, {useEffect, useState} from "react";
import {ResearchAddenda} from "../../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";
import {Link} from "react-router-dom";
import {Container} from "react-bootstrap";
import {MyTable} from "../../components/MyTable";

type AddendaProps = {
    addendas: ResearchAddenda[]
    renderDetails: () => void
}

export function ResearchAddendaTab(props: AddendaProps) {
    const [addendas, setAddendas] = useState<ResearchAddenda[]>([])

    useEffect(() => {
        setAddendas(props.addendas)
    }, [props.addendas])



    // function getHeaders() : CSVHeader[] {
    //     return researchType === ResearchTypes.CLINICAL_TRIAL.id? tableHeadersClinicalTrials : tableHeadersClinicalStudies
    // }


    const columns = React.useMemo<ColumnDef<ResearchAddenda>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                cell: info => <div>
                    <span>{info.getValue() as string}</span>
                    <br/>
                    <Link to={`#aId=${info.getValue()}`}>Ver Detalhes</Link>
                </div>,
                header: () => <span>Id</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.createdDate?.substring(0, 4) || "Não definido",
                id: 'startDate',
                cell: info => info.getValue(),
                header: () => <span>Dia submetido</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.state?.name,
                id: 'state',
                header: () => <span>Estado</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            }
        ],[])


    return (
        <React.Fragment>

                {/*<Container>*/}
                {/*    <CSVLink*/}
                {/*        className={"float-end mb-2"}*/}
                {/*        headers={getHeaders()}*/}
                {/*        data={proposals.map(p => p.proposal)}*/}
                {/*        filename={`Propostas-${(new Date()).toLocaleDateString()}`}*/}
                {/*    >*/}
                {/*        {`Exportar selecionados ${checkBoxGroupState.totalCheckedItems > 0 ? `(${checkBoxGroupState.totalCheckedItems})` : ''} para Excel`}*/}
                {/*    </CSVLink>*/}
                {/*</Container>*/}


            <Container>
                <MyTable
                    pagination
                    data={addendas}
                    columns={columns}
                />

            </Container>
        </React.Fragment>
    )
}