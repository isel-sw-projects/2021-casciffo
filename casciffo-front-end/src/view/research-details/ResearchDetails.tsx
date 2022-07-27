import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import {Button, Col, Container, FloatingLabel, Row, Stack, Tab, Tabs} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {ResearchModel} from "../../model/research/ResearchModel";
import {ResearchStates} from "./ResearchStates";
import {useParams} from "react-router-dom";
import {MyError} from "../error-view/MyError";
import {useErrorHandler} from "react-error-boundary";
import {StateModel} from "../../model/state/StateModel";
import {ResearchDetailsTab} from "./ResearchDetailsTab";
import {ResearchScientificActivitiesTab} from "./ResearchScientificActivitiesTab";
import {ResearchVisitsTab} from "./ResearchVisitsTab";
import {ResearchAddendaTab} from "./ResearchAddendaTab";
import {ResearchPatientsTab} from "./ResearchPatientsTab";
import {ResearchFinanceTab} from "./ResearchFinanceTab";
import {VerticallyCenteredPopup} from "../components/VerticallyCenteredPopup";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import {bootstrapUtils} from "react-bootstrap/lib/utils";
import {StateFlowTypes} from "../../common/Constants";

export function ResearchDetails(props: { researchService: ResearchAggregateService }) {

    const {researchId} = useParams()
    if(researchId == null) {
        throw new MyError("", 400)
    }
    const errorHandler = useErrorHandler()

    const [research, setResearch] = useState<ResearchModel>({})
    const [stateChain, setStateChain] = useState<StateModel[]>([])
    const [isStateTerminal, setIsStateTerminal] = useState(false)

    useEffect(() => {
        if(stateChain?.length === 0 || research.id == null) return

        setIsStateTerminal(stateChain.some(sc => sc.id === research.id && sc.stateFlowType === StateFlowTypes.TERMINAL))
    }, [research, stateChain])

    useEffect(() => {
        props.researchService
            .fetchResearchStateChain()
            .then(setStateChain, errorHandler)
    }, [props.researchService, researchId, errorHandler])

    useEffect(() => {
        props.researchService
            .fetchResearch(researchId!)
            .then(setResearch, errorHandler)
    }, [props.researchService, researchId, errorHandler])

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

    const onComplete = () => {
        //TODO call service to complete and update research
    }

    const updateResearch = useCallback((data: ResearchModel) => {
        props.researchService
            .updateResearch(data)
            .then(setResearch)
    }, [props.researchService])

    const [selectedTab, setSelectedTab] = useState("research")
    const [isEditing, setIsEditing] = useState(false)
    const toggleIsEditing = () => setIsEditing(prevState => !prevState)

    const [showCancelPopup, setShowCancelPopup] = useState(false)

    return (
        <Container>
            <Tabs
                id="controlled-tab-example"
                activeKey={selectedTab}
                onSelect={tab => setSelectedTab(tab!)}
                className="mb-3 justify-content-evenly"
            >
                <Tab eventKey={"research"} title={"Ensaio Clínico"}>
                    {/*TODO MAKE THE NECESSARY CALLS ON COMPLETE / CANCEL*/}
                    <CancelPopup show={showCancelPopup}
                                 onCloseButtonClick={() => setShowCancelPopup(false)}
                                 onSuccessButtonClick={onCancel}/>
                    <Row className={"border-bottom m-3 justify-content-evenly"}>
                        <Col>
                            <ResearchStates
                                states={stateChain}
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
                                        onClick={toggleIsEditing}
                                        style={{display: isStateTerminal ? "none" : "inherit"}}
                                >
                                    {isEditing ? "Cancelar modo editar" : "Edit"}
                                </Button>
                                <Button className={"float-end m-2"}
                                        variant={"outline-success"}
                                        style={{display: isEditing ? "inherit" : "none"}}
                                        // onClick={up}
                                >
                                    Guardar alterações
                                </Button>
                            </Col>
                    </Row>
                    <ResearchDetailsTab
                        isEditing={isEditing}
                        research={research}
                        updateResearch={updateResearch}/>

                </Tab>
                <Tab eventKey={"addenda"} title={"Adendas"}>
                    <ResearchAddendaTab/>
                </Tab>
                <Tab eventKey={"ativities"} title={"Atividades científicas"}>
                    <ResearchStates
                        states={stateChain}
                        stateTransitions={research.stateTransitions ?? []}
                        currentStateId={research.stateId ?? ""}
                        createdDate={research.startDate ?? ""}
                    />
                    <ResearchScientificActivitiesTab/>

                </Tab>
                <Tab eventKey={"visits"} title={"Visitas"}>
                    <ResearchStates
                        states={stateChain}
                        stateTransitions={research.stateTransitions ?? []}
                        currentStateId={research.stateId ?? ""}
                        createdDate={research.startDate ?? ""}
                    />
                    <ResearchVisitsTab/>

                </Tab>
                <Tab eventKey={"patients"} title={"Pacientes"}>
                    <ResearchStates
                        states={stateChain}
                        stateTransitions={research.stateTransitions ?? []}
                        currentStateId={research.stateId ?? ""}
                        createdDate={research.startDate ?? ""}
                    />
                    <ResearchPatientsTab/>
                </Tab>
                <Tab eventKey={"finance"} title={"Financiamento"}>
                    <ResearchStates
                        states={stateChain}
                        stateTransitions={research.stateTransitions ?? []}
                        currentStateId={research.stateId ?? ""}
                        createdDate={research.startDate ?? ""}
                    />
                    <ResearchFinanceTab/>
                </Tab>
            </Tabs>
        </Container>
    )
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