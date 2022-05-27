import React from "react"
import {Button, Stack, Table} from "react-bootstrap"

type PPT_Props = {

}

export function ProtocolTabContent(props: PPT_Props) {

    const headers = ["Criado", "Nome\n(Empresa/Papel)","Observação","Validado"]

    return (
        <React.Fragment>
            <label>Entidades de competência de avaliação</label>
            <Stack direction={"horizontal"}>
                <Button className={"float-start m-3"} variant={"primary"} disabled>
                    Comissão de Ética para Investigação Clínica
                </Button>
                <Button className={"float-end m-3"} variant={"primary"} disabled>
                    INFARMED, I.P
                </Button>
            </Stack>
            <Table striped bordered hover size={"sm mt-5"}>
                <colgroup>
                    <col span={1} style={{width: "10%"}}/>
                    <col span={1} style={{width: "15%"}}/>
                    <col span={1} style={{width: "55%"}}/>
                    <col span={1} style={{width: "10%"}}/>
                </colgroup>
                <thead key={"timeline-history-headers"}>
                <tr>
                    {headers.map((h,i) => <th key={i}>{h}</th>)}
                </tr>
                </thead>

                <tbody>
                {/*{mapEventsToRow()}*/}
                </tbody>
            </Table>
        </React.Fragment>
    )
}