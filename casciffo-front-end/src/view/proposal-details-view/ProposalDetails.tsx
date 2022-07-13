import {Navigate, useNavigate, useParams} from "react-router-dom";
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
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
import {CommentTypes, ResearchTypes, TOKEN_KEY} from "../../common/Constants";
import {ProposalCommentsModel} from "../../model/proposal/ProposalCommentsModel";
import {ProposalTimelineTabContent} from "./ProposalTimelineTabContent";
import {PartnershipsTabContent} from "./PartnershipsTabContent";
import {TimelineEventModel} from "../../model/TimelineEventModel";
import React from "react";
import {ProposalStateView} from "./ProposalStates";
import {StateModel} from "../../model/state/StateModel";
import {UserToken} from "../../common/Types";
import {ProposalFinancialContractTab} from "./ProposalFinancialContractTab";
import {ValidationCommentDTO, ValidityComment} from "../../model/proposal/finance/ValidationModels";
import {Roles} from "../../model/role/Roles";
import {useUserAuthContext} from "../context/UserAuthContext";

type ProposalDetailsProps = {
    proposalService: ProposalAggregateService
}


function ProposalDetailsTab(props: { dataReady: boolean, proposal: ProposalModel }) {
    return <Container className={"border border-top-0"}>
        {props.dataReady ?
            <Stack direction={"horizontal"}>
                <Container>
                    <Form>
                        <Row className={"mb-2 mt-2"}>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Sigla</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={"sigla"}
                                        value={props.proposal.sigla}
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
                                        value={props.proposal.serviceType?.name}
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
                                        value={props.proposal.principalInvestigator?.name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className={"mb-2"}>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Área terapeutica</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={"therapeuticArea"}
                                        value={props.proposal.therapeuticArea?.name}
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
                                        value={props.proposal.pathology?.name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                {props.proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                                    <Form.Group>
                                        <Form.Label>Promotor</Form.Label>
                                        <Form.Control
                                            type={"text"}
                                            name={"promoterName"}
                                            value={props.proposal.financialComponent?.promoter!.name}
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
                    <ListGroup className={"mb-2"} style={{overflow: "auto", maxHeight: 400}}>
                        {/*TODO eventually add a way to seperate the columns or add overflow*/}
                        {props.proposal.investigationTeam!.map((team, idx) => (
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
    </Container>;
}

export function ProposalDetails(props: ProposalDetailsProps) {
    const {proposalId} = useParams()
    const navigate = useNavigate()
    const {userToken} = useUserAuthContext()
    if(proposalId === undefined || userToken == null) {
        navigate("/propostas")
        //show error and move backwards using navigate
    }

    const [proposal, setProposal] = useState<ProposalModel>({
        createdDate: undefined,
        lastModified: undefined,
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

    const [states, setStates] = useState<StateModel[]>()
    const [isStatesReady, setIsStatesReady] = useState(false)


    // const ProposalStateView = React.memo(ProposalStateView, (prevProps, nextProps) => {
    //     console.log('prevProps:' + prevProps + '\nnextProps:' + nextProps + '\n\n')
    //     return JSON.stringify(prevProps) === JSON.stringify(nextProps)
    // })

    const advanceState = useCallback(() => {
        props.proposalService.advanceState(proposalId!, true)
            .then(setProposal)
            .then(() => alert("Operação sucedida!"))
    }, [proposalId, props.proposalService])

    const [isDataReady, setDataReady] = useState(false)
    const [isError, setIsError] = useState(false)
    const [selectedTab, setSelectedTab] = useState("proposal")

    function checkComments(model: ProposalModel) {
        if(model.comments === undefined) {
            model.comments = []
        }
        return model
    }

    const handleFetchError = useCallback((reason: any) => {
        console.log(reason)
        setIsError(true)
    },[])

    const log = (value: any) => {
        console.log(value);
        return value
    }

    useEffect(() => {
        function removeSuperUserFromRoles(list: StateModel[]) {
            return list.map(s => {
                const idxToRemove = s.roles?.indexOf(Roles.SUPERUSER.id)
                s.name = Object.values(STATES).find(st => st.id === s.name)!.name
                s.roles?.splice(idxToRemove!, 1)
                return s
            })
        }

        function fetchStates(type: string) {
            props.proposalService
                .fetchProposalStates(type)
                .then(removeSuperUserFromRoles)
                .then(setStates)
                .then(_ => setIsStatesReady(true))
        }

        function setProposalAndReturnType(proposal: ProposalModel) {
            setProposal(proposal)
            return proposal.type
        }

        props.proposalService.fetchProposalById(proposalId!)
            .then(log)
            .then(checkComments)
            .then(setProposalAndReturnType)
            .then(fetchStates)
            .then(() => setDataReady(true))
            // .catch(handleFetchError)
    }, [proposalId, props.proposalService])
    

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

    const addNewComment = (comment:string, type:string, userName: string, userId: string) => {
        const commentModel : ProposalCommentsModel = {
            authorId: userToken!.userId,
            commentType: type,
            content: comment,
            proposalId: proposalId!,
            author: {
                userId: userId,
                name: userName
            }
        }

        props.proposalService.saveProposalComment(commentModel)
            .then(value => setProposal(updateState("comments", [...proposal.comments!, value])))
    };

    const handleNewEvent = (event: TimelineEventModel) => {
        props.proposalService.saveTimelineEvent(proposalId!, event)
            .then(value=> setProposal(updateState("timelineEvents", [...proposal.timelineEvents!, value])))
    }
    const handleUpdateEvent = (e: TimelineEventModel) => {
        props.proposalService.updateTimelineEvent(proposalId!, e.id!, true)
            .then(event => {
                const newEvents = proposal.timelineEvents!.map(ev => ev.id !== e.id ? ev : event)
                setProposal(updateState("timelineEvents", newEvents))
                return newEvents
            })
            .then(log)
    }

    const onSubmitValidation = (c: ValidationCommentDTO) => {
        //todo add pfcId hardcoded for and then setProposal with partial updates from both receiving and local proposal
        props.proposalService.validate(proposalId!, proposal.financialComponent!.id!, c)
            // .then(value => setProposal(value.proposal!))
    }

    return (
        <React.Fragment>
            {isError && <Navigate to={"/propostas"}/>}
            <Container>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={selectedTab}
                    onSelect={tab => setSelectedTab(tab!)}
                    className="mb-3"
                >
                    <Tab eventKey="proposal" title="Proposta">
                        {isStatesReady && isDataReady && <ProposalStateView
                            onAdvanceClick={advanceState}
                            timelineEvents={proposal.timelineEvents|| []}
                            stateTransitions={proposal.stateTransitions|| []}
                            submittedDate={proposal.createdDate!}
                            states={states || []}
                        />}

                        <ProposalDetailsTab dataReady={isDataReady} proposal={proposal}/>
                    </Tab>

                    {isDataReady && proposal.type === ResearchTypes.CLINICAL_TRIAL.id &&
                    <Tab eventKey={"proposal_cf"} title={"Contracto financeiro"}>
                        {isStatesReady && isDataReady && <ProposalStateView
                            onAdvanceClick={advanceState}
                            timelineEvents={proposal.timelineEvents|| []}
                            stateTransitions={proposal.stateTransitions|| []}
                            submittedDate={proposal.createdDate!}
                            states={states|| []}
                        />}
                        <ProposalFinancialContractTab
                            pfc={proposal.financialComponent!}
                            comments={proposal.comments || []}
                            onSubmitValidationComment={onSubmitValidation}/>
                    </Tab>
                    }

                    <Tab eventKey="contacts" title="Contactos">
                        {isStatesReady && isDataReady && <ProposalStateView
                            onAdvanceClick={advanceState}
                            timelineEvents={proposal.timelineEvents|| []}
                            stateTransitions={proposal.stateTransitions|| []}
                            submittedDate={proposal.createdDate!}
                            states={states|| []}
                        />}
                        <ProposalCommentsTabContent
                            comments={proposal.comments!}
                            addComment={addNewComment}
                            commentType={CommentTypes.CONTACT}
                        />
                    </Tab>
                    <Tab eventKey="observations" title="Observações">
                        {isStatesReady && isDataReady && <ProposalStateView
                            onAdvanceClick={advanceState}
                            timelineEvents={proposal.timelineEvents|| []}
                            stateTransitions={proposal.stateTransitions|| []}
                            submittedDate={proposal.createdDate!}
                            states={states|| []}
                        />}
                        <ProposalCommentsTabContent
                            comments={proposal.comments!}
                            addComment={addNewComment}
                            commentType={CommentTypes.OBSERVATIONS}
                        />
                    </Tab>

                    {isDataReady && proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                        <Tab eventKey={"partnerships"} title={"Parcerias"}>
                            {isStatesReady && isDataReady && <ProposalStateView
                                onAdvanceClick={advanceState}
                                timelineEvents={proposal.timelineEvents|| []}
                                stateTransitions={proposal.stateTransitions|| []}
                                submittedDate={proposal.createdDate!}
                                states={states|| []}
                            />}
                            <PartnershipsTabContent
                                partnerships={proposal.financialComponent!.partnerships!}
                            />
                        </Tab> :
                        <></>
                    }

                    {isDataReady && proposal.type === ResearchTypes.CLINICAL_TRIAL.id &&
                        <Tab eventKey="protocol" title="Protocolo">
                            <ProtocolTabContent
                                saveProtocolComment={props.proposalService.saveProtocolComment}
                                pfcId={proposal.financialComponent?.id}
                                comments={proposal.comments?.filter(value => value.commentType === CommentTypes.PROTOCOL.id) || []}
                                setNewComment={(c) => setProposal(updateState("comments", [...proposal.comments!, c]))}
                                protocol={proposal.financialComponent?.protocol}
                            />
                        </Tab>
                    }


                    <Tab eventKey="chronology" title="Cronologia">
                        {isDataReady &&
                            <div>
                                {isStatesReady && <ProposalStateView
                                    onAdvanceClick={advanceState}
                                    timelineEvents={proposal.timelineEvents || []}
                                    stateTransitions={proposal.stateTransitions|| []}
                                    submittedDate={proposal.createdDate!}
                                    states={states|| []}
                                />}
                                <ProposalTimelineTabContent
                                    service={props.proposalService}
                                    timelineEvents={proposal.timelineEvents || []}
                                    setNewTimeLineEvent={handleNewEvent}
                                    updateTimelineEvent={handleUpdateEvent}
                                />
                            </div>
                        }

                    </Tab>
                </Tabs>
            </Container>
        </React.Fragment>
    )
}
