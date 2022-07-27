import {Button, Col, Container, FloatingLabel, Form, Row, Stack} from "react-bootstrap";
import {ResearchModel} from "../../model/research/ResearchModel";
import React, {useEffect, useState} from "react";
import {FormInputHelper} from "./FormInputHelper";
import {ResearchStates} from "./ResearchStates";
import Modal from "react-bootstrap/Modal";
import {StateFlowTypes} from "../../common/Constants";
import {StateModel} from "../../model/state/StateModel";
import ListGroup from "react-bootstrap/lib/ListGroup";

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

    const reset = () => setResearch(previousResearch)

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
        //TODO call service to cancel and update research
        console.log(reason)
        if(reason.length === 0) {
            alert("A razão de cancelamento tem de ser introduzida!")
            return
        }
        //call service and close popup and stop isEditing
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

                <Container>
                    <fieldset>
                        <legend>Dossiers</legend>
                        <div>
                            <ListGroup>
                            {/*    TODO LEFT HERE NEED TO MAP THE DOSSIER VALUES FROM RESEARCH.DOSSIER*/}
                            </ListGroup>
                        </div>
                    </fieldset>
                </Container>
            {/* TODO AND ADD IN A BUTTON TO GO BACK TO THE PROPOSAL OF THIS RESEARCH */}
            </>
        }
    </Container>
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