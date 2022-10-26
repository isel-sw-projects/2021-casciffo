import {DossierModel} from "../../../model/research/ResearchModel";
import {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";

export function DossierComponent(props: { dossiers: DossierModel[], onAddDossier: (d: DossierModel) => void }) {
    const freshDossier = (): DossierModel => ({label: "", volume: "", amount: 0})
    const sortDossier = (d: DossierModel, d2: DossierModel) => d2.id! - d.id!
    const [showEntryForm, setShowEntryForm] = useState(false)
    const [entry, setEntry] = useState<DossierModel>(freshDossier())
    const [dossiers, setDossiers] = useState<DossierModel[]>([])

    useEffect(() => {
        setDossiers(props.dossiers.sort(sortDossier))
    }, [props.dossiers])

    const toggleEntryForm = () => setShowEntryForm(prevState => !prevState)
    const updateEntry = (e: any) => setEntry(prevState => ({...prevState, [e.target.name]: e.target.value}))
    const reset = () => {
        toggleEntryForm()
        setEntry(freshDossier())
    }
    const handleSubmit = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        props.onAddDossier(entry)
        reset()
    }

    return <Container>
        <fieldset className={"border border-secondary p-3 m-1"}>
            <legend className={"float-none w-auto p-2"}>Dossiers</legend>
            <div>
                {!showEntryForm &&
                    <Button variant={"outline-primary float-start m-2"}
                            onClick={toggleEntryForm}
                            style={{borderRadius: "8px"}}>
                        Nova entrada
                    </Button>
                }
                {showEntryForm &&
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <h5 className={"m-2"}>Nova Entrada</h5>
                            <Col>
                                <Form.Group className={"m-2"}>
                                    <Form.FloatingLabel className={"font-bold"} label={"Label"}>
                                        <Form.Control
                                            type={"input"}
                                            value={entry.label}
                                            name={"label"}
                                            placeholder={"Label"}
                                            onChange={updateEntry}
                                        />
                                    </Form.FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className={"m-2"}>
                                    <Form.FloatingLabel className={"font-bold"} label={"Volume"}>
                                        <Form.Control
                                            type={"input"}
                                            value={entry.volume}
                                            name={"volume"}
                                            placeholder={"Volume"}
                                            onChange={updateEntry}
                                        />
                                    </Form.FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className={"m-2"}>
                                    <Form.FloatingLabel className={"font-bold"} label={"Número"}>
                                        <Form.Control
                                            type={"number"}
                                            value={entry.amount}
                                            name={"amount"}
                                            placeholder={"Número"}
                                            onChange={updateEntry}
                                        />
                                    </Form.FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant={"outline-danger float-start m-2"} onClick={reset}>Cancelar</Button>
                        <Button variant={"outline-success float-end m-2"} type={"submit"}>Adicionar</Button>
                    </Form>
                }
                <Table striped bordered className={"m-2 justify-content-evenly"}>
                    <thead>
                    <tr>
                        {["Label", "Volume", "Número"].map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {dossiers.length > 0 ? props.dossiers.map(d =>
                        <tr key={d.id}>
                            {[d.label, d.volume, d.amount].map((cell, i) => <td key={i}>{cell}</td>)}
                        </tr>
                    ) : <tr>
                        <td colSpan={3}>Sem dossiers.</td>
                    </tr>}
                    </tbody>
                </Table>
            </div>
        </fieldset>
    </Container>;
}