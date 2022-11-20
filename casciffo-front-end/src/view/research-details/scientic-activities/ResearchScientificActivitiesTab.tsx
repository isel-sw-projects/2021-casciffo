import React, {useCallback, useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {ScientificActivityModel} from "../../../model/research/ResearchModel";
import {MyTable} from "../../components/MyTable";
import {
    Breadcrumb,
    Button,
    Container,
    Form,
    FormGroup,
    Stack
} from "react-bootstrap";
import {MyUtil} from "../../../common/MyUtil";
import {FloatingLabelHelper} from "../../components/FloatingLabelHelper";
import {ResearchTypes} from "../../../common/Constants";

type MyProps = {
    onSaveActivity: (activity: ScientificActivityModel) => void
    scientificActivities: ScientificActivityModel[]
}

export function ResearchScientificActivitiesTab(props: MyProps) {

    const [activities, setActivities] = useState<ScientificActivityModel[]>([])
    
    useEffect(() => {
        setActivities(props.scientificActivities)
    }, [props.scientificActivities])

    const columns = React.useMemo<ColumnDef<ScientificActivityModel>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                cell: info => <div>
                    <span>{info.getValue() as string}</span>
                </div>,
                header: () => <span>Id</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.studyType,
                id: 'studyType',
                cell: info => info.getValue(),
                header: () => <span>Tipo de estudo</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.datePublished,
                id: 'datePublished',
                cell: info => info.getValue() && MyUtil.formatDate(info.getValue() as string),
                header: () => <span>Data</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.author,
                id: 'author',
                header: () => <span>Autoria</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.publicationType,
                id: 'publicationType',
                header: () => <span>Tipo de publicação</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.paperName,
                id: 'paperName',
                header: () => <span>Revista</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.datePublished?.substring(0, 4) || "Não específicado",
                id: 'yearPublished',
                header: () => <span>Ano de publicação</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.volume,
                id: 'volume',
                header: () => <span>Volume</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.volumeNumber,
                id: 'volumeNumber',
                header: () => <span>Número</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.paperNumPages,
                id: 'paperNumPages',
                header: () => <span>Página</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.countryPublished,
                id: 'countryPublished',
                header: () => <span>País</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.hasBeenIndexed,
                id: 'hasBeenIndexed',
                header: () => <span>Indexação</span>,
                cell: info => info.getValue() ? "Indexada" : "Não Indexada",
                footer: props => props.column.id,
            }],[])
    
    const resetEntry = (): ScientificActivityModel => ({
        id: "",
        researchId: "",
        datePublished: "",
        author: "",
        paperName: "",
        volume: "",
        volumeNumber: "",
        paperNumPages: "",
        countryPublished: "",
        hasBeenIndexed: false,
        publishedUrl: "",
        publicationType: "",
        studyType: "",
    })

    const [showEntryForm, setShowEntryForm] = useState(false)
    const [newEntry, setNewEntry] = useState<ScientificActivityModel>(resetEntry())

    const beginEntry = () => setShowEntryForm(true)
    const saveEntry = useCallback(() => {
        props.onSaveActivity(newEntry)
        setNewEntry(resetEntry())
    },[newEntry, props])

    const updateNewEntry = (e: any) => setNewEntry(prevState => ({...prevState, [e.target.name]: e.target.value}))

    return <React.Fragment>
        <br/>
        <Container>
            <Breadcrumb className={"m-2 m-md-2 flex"}>
                <Breadcrumb.Item className={"font-bold"} active>Atividades Científicas</Breadcrumb.Item>
            </Breadcrumb>
            <br/>
            <Button variant={"outline-primary"}>Ver Indicadores</Button>
        </Container>
        <br/>
        <Container>
            { showEntryForm &&
                    <Form className={"m-2 p-2 flex"} style={{width:"40%"}} onSubmit={saveEntry}>
                        <fieldset className={"border border-secondary"}>
                            <legend className={"float-none w-auto p-2"}>Nova atividade ciêntífica</legend>
                            <Form.Group>
                                <Form.Select
                                    key={"research-type-id"}
                                    required
                                    aria-label="research type selection"
                                    name={"studyType"}
                                    className={"font-bold text-center"}
                                    defaultValue={-1}
                                    onChange={updateNewEntry}
                                >
                                    <option key={"op-invalid"} value={-1} disabled>(Tipo de estudo)</option>
                                    {Object.values(ResearchTypes).map(t =>
                                        <option key={`op-${t.id}`} value={t.id}>{t.name}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                            <FloatingLabelHelper
                                label={"Autoria"}
                                name={"author"}
                                value={newEntry.author}
                                onChange={updateNewEntry}
                            />
                            <FloatingLabelHelper
                                label={"Tipo de publicação"}
                                name={"publicationType"}
                                value={newEntry.publicationType}
                                onChange={updateNewEntry}
                            />
                            <FloatingLabelHelper
                                label={"Revista"}
                                name={"paperName"}
                                value={newEntry.paperName}
                                onChange={updateNewEntry}
                            />
                            <FloatingLabelHelper
                                label={"Ano de publicação"}
                                name={"yearPublished"}
                                value={MyUtil.getDateTimeField(newEntry.datePublished, "year")}
                            />
                            <FloatingLabelHelper
                                label={"Volume"}
                                name={"volume"}
                                value={newEntry.volume}
                                onChange={updateNewEntry}
                            />
                            <FloatingLabelHelper
                                label={"Número"}
                                name={"volumeNumber"}
                                value={newEntry.volumeNumber}
                                onChange={updateNewEntry}
                            />
                            <FloatingLabelHelper
                                label={"Páginas"}
                                name={"paperNumPages"}
                                value={newEntry.paperNumPages}
                                onChange={updateNewEntry}
                            />
                            <FormGroup className={"m-2"}>
                                <Stack direction={"horizontal"} gap={2}>
                                    <Form.Check
                                        key={"switch-index"}
                                        type={"switch"}
                                        name={"hasBeenIndexed"}
                                        checked={newEntry.hasBeenIndexed}
                                        onChange={(() => setNewEntry(prevState => ({...prevState, hasBeenIndexed: !prevState.hasBeenIndexed})))}
                                        label={<span className={"font-bold"}>Indexação</span>}
                                    />
                                    <Form.Control type={"text"} disabled value={newEntry.hasBeenIndexed ? "Indexada" : "Não indexada"}/>
                                </Stack>
                            </FormGroup>
                        { showEntryForm &&
                             <div className={"flex-column m-2 m-md-2"}>
                                <div>
                                    <Button variant={"outline-primary float-start ms-2 ms-md-2 mb-3 mb-md-3"} type={"submit"}>Submeter</Button>
                                </div>
                                <div>
                                    <Button variant={"outline-danger float-end ms-2 ms-md-2 mb-3 mb-md-3"} onClick={() => {setShowEntryForm(false); resetEntry()}}>Cancelar</Button>
                                </div>
                            </div>
                        }
                        </fieldset>
                    </Form>
            }
            {
                !showEntryForm &&
                <Button variant={"outline-primary"} onClick={beginEntry}>Nova entrada</Button>
            }
        </Container>
        <br/>
        <Container className={"m-2 mt-5 mb-5"}>
            <MyTable data={activities} columns={columns}/>
        </Container>
    </React.Fragment>
}