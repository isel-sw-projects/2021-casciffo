import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    Form,
    ListGroup,
    Row,
    Stack,
    Tab,
    Tabs,
    ToggleButton
} from "react-bootstrap";
import {StateService} from "../../services/StateService";
import {STATES} from "../../model/state/STATES";
import {Util} from "../../common/Util";
import {ProposalCommentsTabContent} from "./ProposalCommentsTabContent";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import { ProtocolTabContent } from "./ProtocolTabContent";
import {CommentTypes, ResearchTypes} from "../../common/Constants";
import {ProposalCommentsModel} from "../../model/proposal/ProposalCommentsModel";
import {ProposalTimelineTabContent} from "./ProposalTimelineTabContent";
import {PartnershipsTabContent} from "./PartnershipsTabContent";
import {TimelineEventModel} from "../../model/TimelineEventModel";
import React from "react";

type ProposalDetailsProps = {
    proposalService: ProposalAggregateService
    stateService: StateService
}

function ProposalStateView(props: { element: JSX.Element, onAdvanceClick: () => void }) {
    return <Container className={"align-content-center border-bottom"}>
        {
                props.element
        }
    </Container>;
}

export function ProposalDetails(props: ProposalDetailsProps) {
    const {proposalId} = useParams()
    const navigate = useNavigate()
    if(proposalId === undefined) {
        navigate("/propostas")
        //show error and move backwards using navigate
    }

    const [proposal, setProposal] = useState<ProposalModel>({
        dateCreated: undefined,
        dateModified: undefined,
        financialComponent: undefined,
        id: 0,
        investigationTeam: undefined,
        pathology: undefined,
        pathologyId: 0,
        principalInvestigator: undefined,
        principalInvestigatorId: 0,
        serviceType: undefined,
        serviceTypeId: 0,
        sigla: "",
        state: undefined,
        stateId: 0,
        therapeuticArea: undefined,
        therapeuticAreaId: 0,
        type: ""
    })
    const [isDataReady, setDataReady] = useState(false)
    const [isError, setIsError] = useState(false)
    const [selectedTab, setSelectedTab] = useState("proposal")
    const [selectedState, setSelectedState] = useState("")

    function checkComments(model: ProposalModel) {
        if(model.comments === undefined) {
            model.comments = []
        }
        return model
    }

    function handleFetchError(reason: any) {
        console.log(reason)
        setIsError(true)
        navigate("/propostas")
    }

    useEffect(() => {
        props.proposalService.fetchProposalById(proposalId!)
            // .then(value => {
            //     console.log(value);
            //     return value
            // })
            .then(checkComments)
            .then(setProposal)
            .then(() => setDataReady(true))
            .catch(handleFetchError)
    }, [proposalId, props.proposalService, navigate])

    function advanceState() {
        props.proposalService.advanceState(proposalId!, true).then(setProposal)
    }
    function showStates() {

        if (!isDataReady) return <span>A carregar estado...</span>

        function getDeadlineDateForState(stateName: string) {
            const event = proposal.timelineEvents?.find(e => e.stateName === stateName)
            if (event === undefined) {
                return "Limite ---"
            }
            return Util.formatDate(event!.deadlineDate!)
        }

        return (<Container>
                <Container>
                    <label style={{fontSize: "1.2rem"}}><b>Estado</b></label>
                    <Button className={"float-end mb-2"} variant={"outline-secondary"} onClick={advanceState}>Progredir
                        estado</Button>
                    <br/>
                </Container>
                <Container>
                    <ButtonGroup className={"mb-3"} style={{width: "100%"}}>
                        <ToggleButton
                            key={`initial-state`}
                            id={`radio-0`}
                            type="radio"
                            variant={selectedState === STATES.SUBMETIDO.id ? 'primary' : 'outline-primary'}
                            name="radio"
                            value={STATES.SUBMETIDO.id}
                            checked={selectedState === STATES.SUBMETIDO.id}
                            onChange={(e) => setSelectedState(e.currentTarget.value)}
                        >
                            <Stack direction={"vertical"}>
                                <span>{STATES.SUBMETIDO.name}</span>
                                <span>{Util.formatDate(proposal.dateCreated!)}</span>
                                <br/>
                                <span>{STATES.SUBMETIDO.owner}</span>
                            </Stack>
                        </ToggleButton>
                        {Util.proposalStates
                            .map((state, i) => (
                                <ToggleButton
                                    key={`${state}-${i}`}
                                    id={`radio-${i}`}
                                    type="radio"
                                    variant={proposal.stateTransitions?.every(st => st.stateAfter?.name !== state.id) ? 'outline-dark' : 'outline-primary'}
                                    name="radio"
                                    value={state.id}
                                    checked={selectedState === state.id}
                                    disabled={proposal.stateTransitions?.every(st => st.stateAfter?.name !== state.id)}
                                    onChange={(e) => setSelectedState(e.currentTarget.value)}
                                >
                                    <Stack direction={"vertical"}>
                                        <span>{state.name}</span>
                                        {proposal.stateTransitions?.find(st => st.stateAfter?.name === state.id) ?
                                            <span>{Util.formatDate(proposal.stateTransitions!.find(st => st.stateAfter?.name === state.id)!.transitionDate)}</span>
                                            :
                                            <span>{"---"}</span>
                                        }
                                        <span>{getDeadlineDateForState(state.id)}</span>
                                        <span>{state.owner}</span>
                                    </Stack>
                                </ToggleButton>
                            ))}
                    </ButtonGroup>
                </Container>
            </Container>
        )
    }

    const updateState = (key: keyof ProposalModel, value: unknown ) =>
        (
            prevState: ProposalModel
        ): ProposalModel =>
        {
            return ({
                ...prevState,
                [key]: value
            })
        }

    const addNewComment = (comment:string, type:string) => {
        const commentModel : ProposalCommentsModel = {
            //FIXME get author from contextApi
            // for now using the principal investigator of proposal
            authorId: proposal.principalInvestigatorId,
            commentType: type,
            content: comment,
            proposalId: proposalId!
        }
        //FIXME when creating comment this crashes
        props.proposalService.saveProposalComment(commentModel)
            .then(value => {console.log(value); return value})
            .then(value => setProposal(updateState("comments", [...proposal.comments!, value])))
    };

    const handleNewEvent = (event: TimelineEventModel) => {
        props.proposalService.saveTimelineEvent(proposalId!, event)
            .then(value=> setProposal(updateState("timelineEvents", [...proposal.timelineEvents!, value])))
    }

    return (
        <React.Fragment>
            { !isError && <Container>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={selectedTab}
                    onSelect={tab => setSelectedTab(tab!)}
                    className="mb-3"
                >
                    <Tab eventKey="proposal" title="Proposta">
                        <ProposalStateView
                            onAdvanceClick={advanceState}
                            element={showStates()}
                        />

                        <Container className={"border border-top-0"}>
                            {isDataReady ?
                                <Stack direction={"horizontal"}>
                                    <Container>
                                        <Form>
                                            <Row className={"mb-1"}>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Sigla</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"sigla"}
                                                            value={proposal.sigla}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Serviço</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"serviceTypeName"}
                                                            value={proposal.serviceType?.name}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Investigator</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"investigator"}
                                                            value={proposal.principalInvestigator?.name}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className={"mt-2"}>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Área terapeutica</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"therapeuticArea"}
                                                            value={proposal.therapeuticArea?.name}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Patologia</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"pathology"}
                                                            value={proposal.pathology?.name}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    {proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                                                        <Form.Group>
                                                            <Form.Label>Promotor</Form.Label>
                                                            <Form.Control
                                                                type={"text"}
                                                                name={"promoterName"}
                                                                value={proposal.financialComponent?.promoter.name}
                                                                disabled
                                                            />
                                                        </Form.Group>
                                                        : <></>
                                                    }
                                                </Col>
                                            </Row>

                                        </Form>
                                    </Container>
                                    <Container className={"border-start"}>
                                        <label>Equipa</label>
                                        <ListGroup className={"mb-2"} style={{overflow: 'auto', maxHeight: 400}}>
                                            {/*TODO eventually add a way to seperate the columns or add overflow*/}
                                            {proposal.investigationTeam!.map((team, idx) => (
                                                <ListGroup.Item
                                                    as="li"
                                                    className="d-flex justify-content-between align-items-start"
                                                    style={{backgroundColor: (idx & 1) === 1 ? 'white' : 'whitesmoke'}}
                                                    key={`${team.member?.name}-${idx}`}
                                                >
                                                    <small>
                                                        <div className="ms-2 me-auto">
                                                            <div className="fw-bold">{team.member?.name}</div>
                                                            {team.member?.email}
                                                        </div>
                                                    </small>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Container>
                                </Stack>
                                : <span>A carregar dados...</span>
                            }
                        </Container>
                    </Tab>

                    <Tab eventKey="contacts" title="Contactos">
                        <ProposalStateView
                            onAdvanceClick={advanceState}
                            element={showStates()}
                        />
                        <ProposalCommentsTabContent
                            comments={proposal.comments!}
                            addComment={addNewComment}
                            commentType={CommentTypes.CONTACT}
                        />
                    </Tab>
                    <Tab eventKey="observations" title="Observações">
                        <ProposalStateView
                            onAdvanceClick={advanceState}
                            element={showStates()}
                        />
                        <ProposalCommentsTabContent
                            comments={proposal.comments!}
                            addComment={addNewComment}
                            commentType={CommentTypes.OBSERVATIONS}
                        />
                    </Tab>

                    {isDataReady && proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                        <Tab eventKey={"partnerships"} title={"Parcerias"}>
                            <ProposalStateView
                                onAdvanceClick={advanceState}
                                element={showStates()}
                            />
                            <PartnershipsTabContent
                                partnerships={proposal.financialComponent!.partnerships!}
                            />
                        </Tab> :
                        <></>
                    }

                    {isDataReady && proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                        <Tab eventKey="protocol" title="Protocolo">
                            <ProtocolTabContent service={props.proposalService} pfcId={proposal.financialComponent?.id}/>
                        </Tab> :
                        <></>
                    }


                    <Tab eventKey="chronology" title="Cronologia">
                        {isDataReady ?
                            <div>
                                <ProposalStateView
                                    onAdvanceClick={advanceState}
                                    element={showStates()}
                                />
                                <ProposalTimelineTabContent
                                    service={props.proposalService}
                                    timelineEvents={proposal.timelineEvents!}
                                    setNewTimeLineEvent={handleNewEvent}
                                />
                            </div> :
                            <span>A carregar aba...</span>
                        }

                    </Tab>
                </Tabs>
            </Container> }
        </React.Fragment>
    )
}
