import {Button, Col, Container, FloatingLabel, Form, ListGroup, Row, Stack, Table} from "react-bootstrap";
import {Dossier, ResearchModel} from "../../model/research/ResearchModel";
import React, {useCallback, useEffect, useState} from "react";
import {FormInputHelper} from "./FormInputHelper";
import {ResearchStates} from "./ResearchStates";
import Modal from "react-bootstrap/Modal";
import {StateFlowTypes} from "../../common/Constants";
import {StateModel} from "../../model/state/StateModel";
import {useNavigate} from "react-router-dom";

type RDT_Props = {
    research: ResearchModel
    stateChain: StateModel[]
    updateResearch: (data: ResearchModel) => void
}

export function ResearchDetailsTab(props: RDT_Props) {
    const [dataReady, setDataReady] = useState(false)
    const [research, setResearch] = useState<ResearchModel>({})
    const [previousResearch, setPreviousResearch] = useState<ResearchModel>({})
    const [isStateTerminal, setIsStateTerminal] = useState(false)

    useEffect(() => {
        if(props.stateChain?.length === 0 || props.research.id == null) return

        setIsStateTerminal(props.stateChain.some(sc => sc.id === props.research.id && sc.stateFlowType === StateFlowTypes.TERMINAL))
    }, [props.research, props.stateChain])

    useEffect(() => {
        if(props.research?.id != null) {
            setResearch(props.research)
            setPreviousResearch(props.research)
            setDataReady(true)
        }
    }, [props.research])

    const updateState = (key: keyof ResearchModel, value: unknown) =>
        (
            prevState: ResearchModel
        ): ResearchModel => {
            return ({
                ...prevState,
                [key]: value
            })
        }

    const updateResearch = (e: any) => {
        const key: keyof ResearchModel = e.target.name
        const value: unknown = e.target.value
        setResearch(updateState(key, value))
    }

    const [isEditing, setIsEditing] = useState(false)
    const toggleIsEditing = () => setIsEditing(prevState => !prevState)

    const [showCancelPopup, setShowCancelPopup] = useState(false)

    const onCancel = (reason: string) => {
        console.log(reason)
        if(reason.length === 0) {
            alert("A razão de cancelamento tem de ser introduzida!")
            return
        }
        //TODO call service to cancel and set updated research


        // close popup and stop isEditing
        setShowCancelPopup(false)
        setIsEditing(false)
    }

    const saveChanges = () => {
        props.updateResearch(research)
        setIsEditing(false)
    }

    const cancelChanges = () => {
        setResearch(previousResearch)
        setIsEditing(false)
    }

    const onComplete = () => {
        //TODO call service to complete and update research
    }
    
    const navigate = useNavigate()
    const navigateToProposal = useCallback(() => {
        navigate(`/propostas/${research.proposalId!}`)
    }, [navigate, research.proposalId])

    return <Container>
        <CancelPopup show={showCancelPopup}
                     onCloseButtonClick={() => setShowCancelPopup(false)}
                     onSuccessButtonClick={onCancel}/>
        <Row className={"border-bottom m-3 justify-content-evenly"}>
            <Col>
                <ResearchStates
                    states={props.stateChain}
                    stateTransitions={research.stateTransitions ?? []}
                    currentStateId={research.stateId ?? ""}
                    createdDate={research.startDate ?? ""}
                />
            </Col>
            <Col>
                {isEditing &&
                    <Stack direction={"vertical"}>
                        <Button className={"flex float-start m-2"} variant={"outline-danger"}
                                onClick={() => setShowCancelPopup(true)}>Cancelar Ensaio</Button>
                        <Button className={"flex float-start m-2"} variant={"outline-success"}
                                onClick={onComplete}>Concluir Ensaio</Button>
                    </Stack>
                }
            </Col>
            <Col>
                {/*TODO EVENTUALLY ADD TOOLTIP SAYING CANT EDIT TERMINAL STATE CBA RN SRY*/}
                <Button className={"float-end m-2"}
                        variant={isEditing ? "outline-danger" : "outline-primary"}
                        onClick={isEditing ? cancelChanges : toggleIsEditing}
                        style={{display: isStateTerminal ? "none" : "inherit"}}
                >
                    {isEditing ? "Cancelar modo editar" : "Edit"}
                </Button>
                <Button className={"float-end m-2"}
                        variant={"outline-success"}
                        style={{display: isEditing ? "inherit" : "none"}}
                        onClick={saveChanges}
                >
                    Guardar alterações
                </Button>
            </Col>
        </Row>

        {dataReady &&
            <>
                <Form>
                    <Row>
                        <FormInputHelper
                            label={"Data início"}
                            type={"date"}
                            value={research.startDate}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Data prevista de conclusão"}
                            type={"date"}
                            value={research.estimatedEndDate}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Pacientes previstos"}
                            value={research.estimatedPatientPool}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Pacientes Atuais"}
                            value={`${research.patients?.length ?? 0}`}
                            onChange={updateResearch}
                        />
                    </Row>
                    <Row>
                        <FormInputHelper
                            label={"Sigla"}
                            value={research.proposal!.sigla}/>
                        <FormInputHelper
                            label={"Serviço"}
                            value={research.proposal!.serviceType!.name}/>
                        <FormInputHelper
                            label={"Área terapeutica"}
                            value={research.proposal!.therapeuticArea!.name}/>
                        <FormInputHelper
                            label={"Patologia"}
                            value={research.proposal!.pathology!.name}/>
                    </Row>
                    <Row>
                        <FormInputHelper
                            label={"Investigador Principal"}
                            value={research.proposal!.principalInvestigator!.name}/>
                        <FormInputHelper
                            label={"Promotor"}
                            value={research.proposal!.financialComponent?.promoter?.name ?? "Não aplicável"}/>
                        <FormInputHelper
                            label={"Financiamento"}
                            value={research.proposal!.financialComponent == null ? "Sem financiamento" : "Com financiamento"}/>
                        <FormInputHelper
                            label={"Indústria"}
                            value={research.industry}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                    </Row>
                    <Row>
                        <FormInputHelper
                            label={"Iniciativa"}
                            value={research.eudra_ct!}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Protocolo"}
                            value={research.sampleSize!}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Fases"}
                            value={research.estimatedPatientPool}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Amostra"}
                            value={research.cro}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                    </Row>
                    <Row>
                        <FormInputHelper
                            label={"EudraCT"}
                            value={research.eudra_ct!}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Amostra"}
                            value={research.sampleSize!}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Doentes previstos"}
                            value={research.estimatedPatientPool}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"CRO"}
                            value={research.cro}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                    </Row>
                </Form>

                {/* TODO TEST ADD AND STATE CHANGES */}
                <DossierComponent dossiers={research.dossiers ?? []} onAddDossier={(d) => console.log("called! with ", d)}/>
                <Container className={"mt-4"}>
                    <Button variant={"outline-primary"}
                            className={"ml-2 mt-3 mb-5 rounded rounded-end"}
                            style={{width:"100%"}}
                            onClick={navigateToProposal}>
                        Ver Proposta
                    </Button>
                </Container>
            </>
        }
    </Container>
}

function DossierComponent(props: { dossiers: Dossier[], onAddDossier: (d: Dossier) => void}) {
    const [showEntryForm, setShowEntryForm] = useState(false)
    const [entry, setEntry] = useState<Dossier>({})

    const toggleEntryForm = () => setShowEntryForm(prevState => !prevState)
    const updateEntry = (e: any) => setEntry(prevState => ({...prevState, [e.target.name]: e.target.value}))
    const reset = () => {
        toggleEntryForm()
        setEntry({})
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
                { !showEntryForm &&
                    <Button variant={"outline-primary float-start mb-2"}
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
                            {["Label", "Volume", "Número"].map((h,i) => <th key={i}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {props.dossiers.map(d =>
                            <tr key={d.id}>
                                {[d.label, d.volume, d.amount].map((cell, i) => <td key={i}>{cell}</td>)}
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </fieldset>
    </Container>;
}

function CancelPopup(
    props: {
        show: boolean,
        onCloseButtonClick: () => void,
        onSuccessButtonClick: (reason: string) => void
    }) {
    const [reason, setReason] = useState<string>("")

    return (
        <Modal
            show={props.show}
            onHide={props.onCloseButtonClick}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className={"font-bold"} style={{color: "lightsalmon"}}>
                    Cancelar Ensaio
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <FloatingLabel label={"Razão de cancelamento"}>
                            <Form.Control
                                required
                                isInvalid={reason.length === 0}
                                onChange={(e: any) => setReason(e.target.value)}
                                value={reason}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                Tem de existir razão de cancelamento!
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className={"flex float-start"} onClick={props.onCloseButtonClick}
                        variant={"outline-danger"}>Fechar</Button>
                <Button className={"flex float-end"} onClick={() => props.onSuccessButtonClick(reason)}
                        variant={"outline-success"}>Ok</Button>
            </Modal.Footer>
        </Modal>
    )
}
