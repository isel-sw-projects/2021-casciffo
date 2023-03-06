import React, {useEffect, useState} from "react";
import {ResearchAddenda} from "../../../model/research/ResearchModel";
import {ColumnDef} from "@tanstack/react-table";
import {Button, Container, Form, Stack} from "react-bootstrap";
import {MyTable} from "../../components/MyTable";
import {MyError} from "../../error-view/MyError";
import {BsDownload} from "react-icons/bs";
import {useToastMsgContext} from "../../context/ToastMsgContext";
import {RequiredLabel} from "../../components/RequiredLabel";
import {MyUtil} from "../../../common/MyUtil";
import {STATES} from "../../../model/state/STATES";

type AddendaProps = {
    addendas: ResearchAddenda[]
    renderDetails: (aId: string) => void
    downloadAddendaFile: (addendaId: string) => void
    createAddenda: (file: File) => void
}

export function ResearchAddendaTab(props: AddendaProps) {
    const [addendas, setAddendas] = useState<ResearchAddenda[]>([])
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        setAddendas(props.addendas)
    }, [props.addendas])

    // function getHeaders() : CSVHeader[] {
    //     return researchType === ResearchTypes.CLINICAL_TRIAL.id? tableHeadersClinicalTrials : tableHeadersClinicalStudies
    // }

    const [addendaFile, setAddendaFile] = useState<File | null>()
    const {showErrorToastMsg} = useToastMsgContext()

    const resetForm = () => {
        setShowForm(false)
        setAddendaFile(null)
    }

    const handleFileInput = (e: any) => {
        if(e.target.files === null) {
            e.preventDefault()
            e.stopPropagation()
            return
        }
        let file = e.target.files.item(0)

        if(file === null) {
            showErrorToastMsg(new MyError("Ocorreu uma falha ao carregar ficheiro, por favor tente de novo."))
            return;
        }
        setAddendaFile(file)
    }

    const handleAddendaSubmission = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        if(addendaFile == null) {
            showErrorToastMsg(new MyError("A adenda não foi submetida corretamente, por favor escolha um ficheiro."))
            return
        }
        props.createAddenda(addendaFile)
        setAddendaFile(null)
        setShowForm(false)
    }



    const columns = React.useMemo<ColumnDef<ResearchAddenda>[]>(
        () => {
            const downloadFile = (addendaId: string) => {
                props.downloadAddendaFile(addendaId)
            }
            return [
                {
                    accessorFn: row => row.id,
                    id: 'id',
                    cell: info => <div>
                        <span>{info.getValue() as string}</span>
                        <br/>
                        <Button variant={"link"} onClick={() => props.renderDetails(`${info.getValue()}`)}>Ver Detalhes</Button>
                    </div>,
                    header: () => <span>Id</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.createdDate ? MyUtil.formatDate(row.createdDate) : "N/A",
                    id: 'startDate',
                    cell: info => info.getValue(),
                    header: () => <span>Dia submetido</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => STATES[row.state!.name as keyof typeof STATES].name,
                    id: 'state',
                    header: () => <span>Estado</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row =>
                        <Button
                            className={"m-2 m-md-10 p-2 p-md-2"}
                            variant={"link"}
                            onClick={() => downloadFile(row.id!)}>
                            <Stack direction={"horizontal"} gap={3}>
                                <BsDownload size={10000}/>
                                {row.fileInfo!.fileName!.substring(0, row.fileInfo!.fileName!.lastIndexOf('-'))}
                            </Stack>
                        </Button>,
                    id: 'file-name',
                    header: () => <span>Ficheiro</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                }
            ]},[props])


    return (
        <Container className={"border-top border-2 border-secondary"}>

            {
                showForm ?
                    <div style={{marginTop: "5rem", marginBottom:"5rem"}}>
                        <Form onSubmit={handleAddendaSubmission} style={{width: "33%"}}>
                            <Form.Group>
                                <RequiredLabel label={"Addenda"}/>
                                <Form.Control
                                    key={"adenda-file"}
                                    required
                                    type={"file"}
                                    name={"file"}
                                    onInput={handleFileInput}
                                />
                            </Form.Group>
                            <div className={"flex"}>
                                <Button className={"mt-3 float-start"} type={"submit"}>Submeter</Button>
                                <Button className={"mt-3 float-end"} variant={"outline-danger"} onClick={resetForm}>Cancelar</Button>
                            </div>
                        </Form>
                    </div>
                    :
                    <Button className={"mt-5 mb-5"} variant={"outline-primary"} onClick={() => setShowForm(true)}>Nova adenda</Button>
            }
            <div>
                <MyTable
                    pagination
                    data={addendas}
                    columns={columns}
                />
            </div>

        </Container>
    )
}