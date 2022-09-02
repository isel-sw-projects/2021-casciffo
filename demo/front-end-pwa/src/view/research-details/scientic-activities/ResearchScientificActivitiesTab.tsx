import React, {useCallback, useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {ResearchAggregateModel, ScientificActivityModel} from "../../../model/research/ResearchModel";
import {Link} from "react-router-dom";
import {MyTable} from "../../components/MyTable";
import {Breadcrumb, Button, Container, FloatingLabel, Form, FormControl, FormGroup, Stack} from "react-bootstrap";
import {FormInputHelper} from "../research/FormInputHelper";
import {MyUtil} from "../../../common/MyUtil";

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
                    <span>{info.getValue()}</span>
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
                cell: info => info.getValue(),
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

    const [isNewEntry, setIsNewEntry] = useState(false)
    const [newEntry, setNewEntry] = useState<ScientificActivityModel>(resetEntry())

    const beginEntry = () => setIsNewEntry(true)
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
            { isNewEntry &&
                    <Form className={"m-2 p-2 flex"}>
                        <fieldset className={"border border-secondary"}>
                            <legend className={"float-none w-auto p-2"}>Nova atividade ciêntífica</legend>
                            <FloatingLabelHelper
                                label={"Tipo de estudo"}
                                name={"studyType"}
                                value={newEntry.studyType}
                                onChange={updateNewEntry}
                            />
                            <FloatingLabelHelper
                                label={"Data"}
                                name={"datePublished"}
                                value={newEntry.datePublished}
                                onChange={updateNewEntry}
                            />
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
                                value={MyUtil.getYear(newEntry.datePublished)}
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
                                        style={{width:"15%"}}
                                        key={"switch-index"}
                                        type={"switch"}
                                        name={"hasBeenIndexed"}
                                        checked={newEntry.hasBeenIndexed}
                                        onChange={(() => setNewEntry(prevState => ({...prevState, hasBeenIndexed: !prevState.hasBeenIndexed})))}
                                        label={<span className={"font-bold"}>Indexação</span>}
                                    />
                                    <Form.Control style={{width:"15%"}} type={"text"} disabled value={newEntry.hasBeenIndexed ? "Indexada" : "Não indexada"}/>
                                </Stack>
                            </FormGroup>
                        </fieldset>
                    </Form>
            }
            { isNewEntry
                ? <div className={"flex-column m-2"}>
                    <div>
                        <Button variant={"outline-primary float-start"} onClick={saveEntry}>Submeter dados</Button>
                    </div>
                    <div>
                        <Button variant={"outline-danger float-end"} onClick={() => {setIsNewEntry(false); resetEntry()}}>Cancelar</Button>
                    </div>
                </div>
                : <Button variant={"outline-primary"} onClick={beginEntry}>Nova entrada</Button>
            }
        </Container>
        <br/>
        <Container className={"m-2 mt-5 mb-5"}>
            <MyTable data={activities} columns={columns}/>
        </Container>
    </React.Fragment>
}

function FloatingLabelHelper(props: {label: string, name: string, value?: string, onChange?: (e: any) => void}) {
    return (
        <FloatingLabel className={"font-bold text-capitalize m-2"} label={props.label}>
            <Form.Control
                type={"text"}
                value={props.value ?? ""}
                name={props.name}
                placeholder={props.label}
                readOnly={props.onChange == null}
                onChange={props.onChange}
            />
        </FloatingLabel>
    )
}