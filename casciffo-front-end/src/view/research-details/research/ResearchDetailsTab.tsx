import {DossierModel, ResearchModel} from "../../../model/research/ResearchModel";
import {
    Button,
    CloseButton,
    Col,
    Container,
    FloatingLabel,
    Form,
    FormGroup,
    ListGroup,
    ListGroupItem,
    Modal,
    Row,
    Stack
} from "react-bootstrap";
import {ResearchTypes, StateFlowTypes} from "../../../common/Constants";
import {FormInputHelper} from "../../components/FormInputHelper";
import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {StateModel} from "../../../model/state/StateModel";
import {ResearchStates} from "./ResearchStates";
import {MyUtil} from "../../../common/MyUtil";
import {DossierComponent} from "./DossierComponent";


type RDT_Props = {
    research: ResearchModel
    stateChain: StateModel[]
    updateResearch: (data: ResearchModel) => void
    addDossier: (d: DossierModel) => void
    onComplete: () => void
    onCancel: (reason: string) => void
}

export function ResearchDetailsTab(props: RDT_Props) {
    const [dataReady, setDataReady] = useState(false)
    const [research, setResearch] = useState<ResearchModel>({})
    const [previousResearch, setPreviousResearch] = useState<ResearchModel>({})
    const [isStateTerminal, setIsStateTerminal] = useState(false)

    useEffect(() => {
        if(props.stateChain?.length === 0 || props.research.id == null) return
        const isTerminalState = props.research.canceledReason != null || props.stateChain.some(sc => sc.id === props.research.stateId && sc.stateFlowType === StateFlowTypes.TERMINAL)
        setIsStateTerminal(isTerminalState)
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

    const saveChanges = () => {
        if (treatmentBranches.length !== 0) {
            research.treatmentBranches = treatmentBranches.join(';')
            setTreatmentBranches([])
            setCurrentBranch("")
        }

        props.updateResearch(research)
        toggleTreatmentBranchForm()
        setIsEditing(false)
    }

    const cancelChanges = () => {
        setResearch(previousResearch)
        setIsEditing(false)
    }

    const onCancelResearch = (reason: string) => {
        // console.log(reason)
        if(reason.length === 0) {
            alert("A razão de cancelamento tem de ser introduzida!")
            return
        }
        //call service to cancel research, update is done automatically in parent
        props.onCancel(reason)
        // close popup and stop isEditing
        setShowCancelPopup(false)
        setIsEditing(false)
    }

    const onConcludeResearch = () => {
        props.onComplete()
    }

    const navigate = useNavigate()
    const navigateToProposal = useCallback(() => {
        navigate(`/propostas/${research.proposalId!}`)
    }, [navigate, research.proposalId])

    const [currentBranch, setCurrentBranch] = useState("")
    const [showTreatmentBranchForm, setShowTreatmentBranchForm] = useState(false)

    const addBranch = () => {
        //todo eventually add a warning message when input is invalid
        if(currentBranch.length === 0) return
        setTreatmentBranches(prevState => [currentBranch, ...prevState])
        setCurrentBranch("")
    }

    const removeBranch = (b: string) => {
        setTreatmentBranches(prevState => prevState.filter(v => v !== b))
    }

    const toggleTreatmentBranchForm = () => setShowTreatmentBranchForm(prevState => !prevState)

    const [treatmentBranches, setTreatmentBranches] = useState<string[]>([])

    return <Container>
        <CancelPopup show={showCancelPopup}
                     onCloseButtonClick={() => setShowCancelPopup(false)}
                     onSuccessButtonClick={onCancelResearch}/>
        <Row className={"justify-content-evenly border-bottom border-2 border-secondary"}>
            <Col>
                <ResearchStates
                    states={props.stateChain}
                    stateTransitions={research.stateTransitions ?? []}
                    currentState={research.state}
                    createdDate={research.startDate ?? ""}
                    canceledReason={research.canceledReason}
                    canceledBy={research.canceledBy}
                />
            </Col>
            <Col>
                {isEditing &&
                    <Stack direction={"vertical"}>
                        <Button className={"flex float-start m-2"} variant={"outline-danger"}
                                onClick={() => setShowCancelPopup(true)}>Cancelar Ensaio</Button>
                        <Button className={"flex float-start m-2"} variant={"outline-success"}
                                onClick={onConcludeResearch}>Concluir Ensaio</Button>
                    </Stack>
                }
            </Col>
            <Col>
                <Button className={"float-end m-2"}
                        variant={isEditing ? "outline-danger" : "outline-primary"}
                        onClick={isEditing ? cancelChanges : toggleIsEditing}
                        style={{display: isStateTerminal ? "none" : "inherit"}}
                >
                    {isEditing ? "Cancelar modo editar" : "Editar"}
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

        <Container className={"mt-4 mb-4"}>
            <Row className={"mb-4"}>
                <Col>
                    { isEditing &&
                        <Container className={"flex-column float-start"}>
                            <Button variant={"outline-primary"} onClick={toggleTreatmentBranchForm}>Definir braços de tratamento</Button>
                            {
                                showTreatmentBranchForm &&
                                <Form className={"m-2"}>
                                    <FormGroup className={"mt-2 mb-2"}>
                                        <FloatingLabel label={"Nome do braço de tratamento"}>
                                            <Form.Control
                                                placeholder={"Nome do braço de tratamento"}
                                                type={"text"}
                                                value={currentBranch}
                                                onChange={e => setCurrentBranch(e.target.value)}
                                            />
                                        </FloatingLabel>
                                    </FormGroup>
                                    <Button variant={"outline-primary"} onClick={addBranch}>Adicionar</Button>

                                    <ListGroup>
                                        {treatmentBranches.map((b, i) =>
                                            <ListGroupItem className={"mt-1 mb-1"} key={b} style={{backgroundColor: (i & 1) === 1 ? "whitesmoke" : "wheat"}}>
                                                {b} <CloseButton onClick={() => removeBranch(b)}/>
                                            </ListGroupItem>
                                        )}
                                    </ListGroup>
                                </Form>
                            }
                        </Container>
                    }
                </Col>
                <Col/>
                <Col/>
            </Row>

            <Row>
                <Col>
                    <h5>Braços de tratamento</h5>
                    <ListGroup>
                        {research.treatmentBranches?.split(';')?.map((b, i) =>
                        <ListGroupItem
                            disabled={!isEditing}
                            as="li"
                            className="d-flex justify-content-between align-items-start mb-1"
                            key={`${b}-${i}}`}
                            style={{backgroundColor: (i & 1) === 1 ? "whitesmoke" : "white"}}>{b}</ListGroupItem>
                        ) || "Nenhum definido"}
                    </ListGroup>
                </Col>
                <Col/>
                <Col/>
            </Row>

        </Container>

        {dataReady &&
            <>
                <Form>
                    <Row>
                        <FormInputHelper
                            label={"Data início"}
                            type={"date"}
                            name={"startDate"}
                            value={research.startDate}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Data prevista de conclusão"}
                            type={"date"}
                            name={"estimatedEndDate"}
                            value={research.estimatedEndDate}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Duração prevista (anos)"}
                            type={"number"}
                            value={MyUtil.yearRatioDiff(research.startDate, research.estimatedEndDate)}
                        />
                        <FormInputHelper
                            label={"Duração prevista (meses)"}
                            type={"number"}
                            value={MyUtil.monthDiff(research.startDate, research.estimatedEndDate)}
                        />
                    </Row>
                    <Row>
                        <FormInputHelper
                            label={"Tipo de ensaio"}
                            value={ResearchTypes[research.type as keyof typeof ResearchTypes].singularName}
                        />
                        <FormInputHelper
                            label={"Específicação"}
                            value={research.specification}
                            name={"specification"}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Tipo de medicamento experimental"}
                            value={research.treatmentType}
                            name={"treatmentType"}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Tipologia"}
                            value={research.typology}
                            name={"typology"}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                    </Row>
                    <Row>
                        <FormInputHelper
                            label={"Pacientes previstos"}
                            type={"number"}
                            value={research.estimatedPatientPool}
                            name={"estimatedPatientPool"}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Pacientes Atuais"}
                            value={`${research.patients?.length ?? 0}`}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Amostra"}
                            type={"number"}
                            value={research.sampleSize}
                            name={"sampleSize"}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"EudraCT"}
                            value={research.eudra_ct}
                            name={"eudra_ct"}
                            editing={isEditing}
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
                            name={"industry"}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                    </Row>
                    <Row>
                        <FormInputHelper
                            label={"Iniciativa"}
                            value={research.initiativeBy}
                            name={"initiativeBy"}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        <FormInputHelper
                            label={"Protocolo"}
                            value={research.protocol}
                            name={"protocol"}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                        {
                            research.type === ResearchTypes.CLINICAL_TRIAL.id ?
                                <FormInputHelper
                                    label={"Fases"}
                                    value={research.phase}
                                    name={"phase"}
                                    editing={isEditing}
                                    onChange={updateResearch}
                                />
                                :
                                <FormInputHelper
                                    label={"Fases"}
                                    value={"Não aplicável"}
                                />
                        }
                        <FormInputHelper
                            label={"CRO"}
                            value={research.cro}
                            name={"cro"}
                            editing={isEditing}
                            onChange={updateResearch}
                        />
                    </Row>
                </Form>

                <DossierComponent dossiers={props.research.dossiers ?? []} onAddDossier={props.addDossier}/>
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
                        variant={"outline-danger"}>Voltar</Button>
                <Button className={"flex float-end"} onClick={() => props.onSuccessButtonClick(reason)}
                        variant={"outline-success"}>Ok</Button>
            </Modal.Footer>
        </Modal>
    )
}
