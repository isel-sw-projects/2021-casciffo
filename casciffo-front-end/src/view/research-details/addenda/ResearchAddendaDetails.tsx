import {AddendaCommentsModel, ResearchAddenda} from "../../../model/research/ResearchModel";
import {ResearchAggregateService} from "../../../services/ResearchAggregateService";
import {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import {MyUtil} from "../../../common/MyUtil";
import {ADDENDA_ID_PARAMETER} from "../../../common/Constants";
import {MyError} from "../../error-view/MyError";
import {useErrorHandler} from "react-error-boundary";
import React from "react";
import {Breadcrumb, Button, Container, Stack} from "react-bootstrap";
import {MyTable} from "../../components/MyTable";
import {ColumnDef} from "@tanstack/react-table";
import {BsDownload} from "react-icons/bs";
import {AddendaObservationForm} from "./AddendaObservationForm";
import {useToken} from "../../../custom_hooks/useToken";
import {AddendaStates} from "./AddendaStates";
import {useToastMsgContext} from "../../context/ToastMsgContext";


type Props = {
    service: ResearchAggregateService
    onRenderOverviewClick: (modifiedAddenda: ResearchAddenda) => void
}

export function ResearchAddendaDetails(props: Props) {

    const [addendaId, setAddendaId] = useState<string>("")
    const [addenda, setAddenda] = useState<ResearchAddenda>({})
    const [isAddendaReady, setIsAddendaReady] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const errorHandler = useErrorHandler()
    const {showErrorToastMsg} = useToastMsgContext()

    const {researchId} = useParams()
    const {hash} = useLocation()

    const [token] = useToken()

    useEffect(() => {
        try {
            const params = MyUtil.parseUrlHash(hash).find(params => params.key === ADDENDA_ID_PARAMETER)
            if (!params) {
                errorHandler(new MyError("Página não existe", 404))
            }
            const pId = params!.value
            setAddendaId(pId)

            props.service
                .fetchAddendaDetails(researchId!, pId)
                .then(setAddenda)
                .then(_ => setIsAddendaReady(true))
                .catch(errorHandler)
        } catch (e: unknown) {
            errorHandler(e)
        }
    }, [errorHandler, hash, props.service, researchId])



    const downloadAddenda = async () => {
        await props.service
            .downloadAddendaFile(researchId!, addendaId)
            .catch(showErrorToastMsg)
    }

    const onObservationSubmit = (obs: string) => {
        const addendaObservation = {
            addendaId: addendaId,
            observation: obs,
            authorId: token!.userId!
        }
        props.service
            .createAddendaObservation(researchId!, addendaId, addendaObservation)
            .then(addendaComment => {
                addendaComment.authorName = token!.userName
                setAddenda(prevState => {
                    const newObservations = [addendaComment, ...prevState.observations ?? []]
                    return {
                        ...prevState,
                        observations: newObservations
                    }
                })
            })
            .catch(showErrorToastMsg)
    }

    const advanceStackOnClick = (currentId: string, currStateName: string, nextStateId:string) => {
        props.service
            .updateAddendaState(researchId!, addendaId, nextStateId)
            .then(value => {
                setAddenda(prevState => {
                    return {
                        ...prevState,
                        stateId: value.stateId,
                        state: value.state,
                        stateTransitions: value.stateTransitions
                    }
                })
            })
            .catch(showErrorToastMsg)
    }

    const onCancelAddenda = (reason: string) => {
        onObservationSubmit(`CANCELAMENTO: ${reason}`)

        props.service
            .cancelAddenda(researchId!, addendaId)
            .then(value => {
                setAddenda(prevState => {
                    return {
                        ...prevState,
                        stateId: value.stateId,
                        state: value.state,
                        stateTransitions: value.stateTransitions
                    }
                })
            })
            .catch(showErrorToastMsg)
    }

    const columns = React.useMemo<ColumnDef<AddendaCommentsModel>[]>(
        () => [
                {
                    accessorFn: row => row.createdDate ? MyUtil.formatDate(row.createdDate , true) : "N/A",
                    id: 'createdDate',
                    cell: info => info.getValue(),
                    header: () => <span>Data criado</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.authorName,
                    id: 'authorName',
                    cell: info => info.getValue(),
                    header: () => <span>Autor</span>,
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => row.observation,
                    id: 'observation',
                    header: () => <span>Observação</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                }
            ],[])

    return <Container className={"border-top border-2 border-secondary"}>

        <Breadcrumb className={"mt-4 flex"}>
            <Breadcrumb.Item className={"font-bold"} onClick={() => props.onRenderOverviewClick(addenda)}>Adendas</Breadcrumb.Item>
            <Breadcrumb.Item className={"font-bold"} active>Detalhes</Breadcrumb.Item>
        </Breadcrumb>

        <Container className={"mt-5"}>
            <h5>Adenda</h5>
            {
            isAddendaReady &&
                <Button variant={"link"} onClick={downloadAddenda}>
                    <Stack direction={"horizontal"} gap={3}>
                        <BsDownload/>
                        {addenda.fileInfo!.fileName!.substring(0, addenda.fileInfo!.fileName!.lastIndexOf('-'))}
                    </Stack>
                </Button>
            }
        </Container>
        {
            isAddendaReady &&
                <AddendaStates
                    addendaId={addendaId}
                    currentStateId={addenda.stateId!}
                    transitions={addenda.stateTransitions!}
                    service={props.service}
                    submittedDate={addenda.createdDate!}
                    onAdvanceClick={advanceStackOnClick}
                    onCancel={onCancelAddenda}
                />
        }

        <Container className={"mb-5 d-block"}>
            {showForm ? <AddendaObservationForm onSubmit={onObservationSubmit} onClose={() => setShowForm(false)}/>
                      : <Button variant={"outline-primary"} onClick={() => setShowForm(true)}>Criar observação</Button>
            }
        </Container>


        <Container className={"mt-5"}>
            <h5>Observações</h5>
            <MyTable
                pagination
                data={addenda.observations ?? []}
                columns={columns}
                loading={!isAddendaReady}
                colgroup={[<col span={1} style={{width: "15%"}}/>,
                    <col span={1} style={{width: "15%"}}/>,
                    <col span={1} style={{width: "70%"}}/>]}
            />
        </Container>
    </Container>
}