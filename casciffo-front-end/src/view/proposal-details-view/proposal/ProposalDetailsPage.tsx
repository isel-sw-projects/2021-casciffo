import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {ProposalModel} from "../../../model/proposal/ProposalModel";
import {
    Container,
    Spinner,
    Tab,
    Tabs,
} from "react-bootstrap";
import {MyUtil} from "../../../common/MyUtil";
import {ProposalCommentsTabContent} from "../comments/ProposalCommentsTabContent";
import ProposalAggregateService from "../../../services/ProposalAggregateService";
import { ProtocolTabContent } from "../protocol/ProtocolTabContent";
import {CommentTypes, ProposalTabNames, ResearchTypes, TAB_PARAMETER} from "../../../common/Constants";
import {ProposalCommentsModel} from "../../../model/proposal/ProposalCommentsModel";
import {ProposalTimelineTabContent} from "../chronology/ProposalTimelineTabContent";
import {PartnershipsTabContent} from "../partnerships/PartnershipsTabContent";
import {TimelineEventModel} from "../../../model/proposal/TimelineEventModel";
import React from "react";
import {ProposalStateView} from "../states/ProposalStates";
import {StateModel} from "../../../model/state/StateModel";
import {ProposalFinancialContractTab} from "../financial-contract/ProposalFinancialContractTab";
import {ValidationCommentDTO, ValidityComment} from "../../../model/proposal/finance/ValidationModels";
import {Roles} from "../../../model/role/Roles";
import {useUserAuthContext} from "../../context/UserAuthContext";
import {useErrorHandler} from "react-error-boundary";
import {ProposalDetailsTab} from "./ProposalDetailsTab";
import {toast, ToastContainer} from "react-toastify";
import {MyError} from "../../error-view/MyError";

type ProposalDetailsProps = {
    proposalService: ProposalAggregateService
}


export function ProposalDetailsPage(props: ProposalDetailsProps) {
    const {proposalId} = useParams()
    const {hash} = useLocation()
    const navigate = useNavigate()
    const {userToken} = useUserAuthContext()
    if (proposalId === undefined || userToken == null) {
        navigate("/propostas")
        //show error and move backwards using navigate
    }

    const showErrorToast = (error: MyError) => toast.error(error.message)
    const errorHandler = useErrorHandler()

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
    const [isDataReady, setDataReady] = useState(false)
    const [selectedTab, setSelectedTab] = useState("proposal")

    useEffect(() => {
        document.title = MyUtil.PROPOSAL_DETAIL_TITLE
    })

    useEffect(() => {
        const params = MyUtil.parseUrlHash(hash).find(p => p.key === TAB_PARAMETER)
        const tabParam = ( params && params.value ) ?? ProposalTabNames.proposal

        setSelectedTab(tabParam)
    }, [hash])



    useEffect(() => {
        const removeSuperUserFromRoles = (list: StateModel[]) =>
            list.map(s => {
                const idxToRemove = s.roles?.indexOf(Roles.SUPERUSER.id)
                // s.name = Object.values(STATES).find(st => st.id === s.name)!.name
                s.roles?.splice(idxToRemove!, 1)
                return s
            })

        const fetchStates = (type: string) =>
            props.proposalService
                .fetchProposalStates(type)
                .then(removeSuperUserFromRoles)
                .then(setStates)
                .then(_ => setIsStatesReady(true))


        const setProposalAndGetItsType = (proposal: ProposalModel) => {
            setProposal(proposal)
            return proposal.type
        }

        props.proposalService.fetchProposalById(proposalId!)
            .then(setProposalAndGetItsType)
            .then(fetchStates)
            .then(() => setDataReady(true))
            .catch(errorHandler)
    }, [errorHandler, proposalId, props.proposalService])


    const advanceState = useCallback((currentId: string, currStateName: string, nextStateId:string) => {
        props.proposalService
            .advanceState(proposalId!, nextStateId)
            .then(setProposal)
            .catch(error => toast.error(error.message))
    }, [proposalId, props.proposalService])

    const updateProtocol = (pfcId: string, validationComment: ValidityComment) => {
        props.proposalService
            .saveProtocolComment(proposalId!, pfcId, validationComment)
            .then(protocolAggregate => {
                setProposal(prevState => ({
                    ...prevState,
                    financialComponent: {
                        ...prevState.financialComponent,
                        protocol: protocolAggregate.protocol
                    },
                    comments: [protocolAggregate.comment!, ...prevState.comments ?? []]
                }))
            })
            .catch(showErrorToast)
    }

    // const handleFetchError = useCallback((reason: any) => {
    //     log(reason)
    //     setIsError(true)
    // }, [])

    // const log = (value: any) => {
    //     console.log(value);
    //     return value
    // }


    const updateState = (key: keyof ProposalModel, value: unknown) =>
        (
            prevState: ProposalModel
        ): ProposalModel => {
            return ({
                ...prevState,
                [key]: value
            })
        }

    const addNewComment = (comment: string, type: string, userName: string, userId: string) => {
        const commentModel: ProposalCommentsModel = {
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
            .catch(showErrorToast)
    };

    const handleNewEvent = (event: TimelineEventModel) => {
        props.proposalService.saveTimelineEvent(proposalId!, event)
            .then(value => setProposal(updateState("timelineEvents", [...proposal.timelineEvents!, value])))
            .catch(showErrorToast)
    }

    const handleUpdateEvent = (e: TimelineEventModel) => {
        props.proposalService.updateTimelineEvent(proposalId!, e.id!, true)
            .then(event => {
                const newEvents = proposal.timelineEvents!.map(ev => ev.id !== e.id ? ev : event)
                setProposal(updateState("timelineEvents", newEvents))
                return newEvents
            })
            .catch(showErrorToast)
    }

    const onSubmitValidation = (c: ValidationCommentDTO, validationType: string) => {
        props.proposalService.validate(proposalId!, proposal.financialComponent!.id!, validationType, c)
            .then(value => {
                // const prev = proposal
                setProposal(prevState => ({
                    ...prevState,
                    state: value.proposal!.state!,
                    stateId: value.proposal!.stateId!,
                    stateTransitions: value.proposal!.stateTransitions!,
                    comments: value.proposal!.comments!,
                    financialComponent: {
                        ...prevState.financialComponent,
                        protocol: value.proposal!.financialComponent!.protocol!,
                        validations: value.proposal!.financialComponent!.validations!
                    }
                }))
            })
            .catch(showErrorToast)
    }

    const downloadCf = async () => {
        await props.proposalService.downloadFinancialContract(proposalId!, proposal.financialComponent!.id!)
    }

    const uploadCf = async (file: File) => {
        await props.proposalService
            .saveFinancialContract(proposalId!, proposal.financialComponent!.id!, file)
            .then(rsp => setProposal(prevState => ({
                ...prevState,
                financialComponent: {
                    ...prevState.financialComponent,
                    financialContract: rsp.data
                }})))
            .catch(showErrorToast)
    }

    const onSelectTab = (tab: string | null) => {
        const args = [
            {key: TAB_PARAMETER, value: tab || ProposalTabNames.proposal}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
    }

    return (
        <React.Fragment>
            <ToastContainer/>
            <Container>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={selectedTab}
                    onSelect={onSelectTab}
                    className="mb-3 justify-content-evenly"
                >
                    <Tab eventKey={ProposalTabNames.proposal} title="Proposta">
                        {isStatesReady && isDataReady
                            ? <ProposalStateView
                                isProtocolValidated={proposal.financialComponent?.protocol?.validated}
                                onAdvanceClick={advanceState}
                                currentStateId={proposal.stateId!}
                                timelineEvents={proposal.timelineEvents ?? []}
                                stateTransitions={proposal.stateTransitions ?? []}
                                submittedDate={proposal.createdDate!}
                                states={states ?? []}
                                showErrorToast={showErrorToast}
                            />
                            : <span><Spinner as={"span"} animation={"border"}/> A carregar estados... </span>
                        }

                        <ProposalDetailsTab dataReady={isDataReady} proposal={proposal}/>
                    </Tab>

                    {isDataReady && proposal.type === ResearchTypes.CLINICAL_TRIAL.id &&
                        <Tab eventKey={ProposalTabNames.proposal_cf} title={"Contracto financeiro"}>
                            {isStatesReady && <ProposalStateView
                                isProtocolValidated={proposal.financialComponent?.protocol?.validated}
                                onAdvanceClick={advanceState}
                                currentStateId={proposal.stateId!}
                                timelineEvents={proposal.timelineEvents ?? []}
                                stateTransitions={proposal.stateTransitions ?? []}
                                submittedDate={proposal.createdDate!}
                                states={states ?? []}
                                showErrorToast={showErrorToast}
                            />}
                            <ProposalFinancialContractTab
                                pfc={proposal.financialComponent!}
                                comments={proposal.comments ?? []}
                                onSubmitValidationComment={onSubmitValidation}
                                downloadCf={downloadCf}
                                uploadCf={uploadCf}
                                showErrorToast={showErrorToast}
                            />
                        </Tab>
                    }

                    <Tab eventKey={ProposalTabNames.contacts} title="Contactos">
                        <ProposalStateView
                            isProtocolValidated={proposal.financialComponent?.protocol?.validated}
                            onAdvanceClick={advanceState}
                            currentStateId={proposal.stateId!}
                            timelineEvents={proposal.timelineEvents ?? []}
                            stateTransitions={proposal.stateTransitions ?? []}
                            submittedDate={proposal.createdDate!}
                            states={states ?? []}
                            showErrorToast={showErrorToast}
                        />
                        <ProposalCommentsTabContent
                            comments={proposal.comments ?? []}
                            addComment={addNewComment}
                            commentType={CommentTypes.CONTACT}
                        />
                    </Tab>
                    <Tab eventKey={ProposalTabNames.observations} title="Observações">
                        <ProposalStateView
                            isProtocolValidated={proposal.financialComponent?.protocol?.validated}
                            onAdvanceClick={advanceState}
                            currentStateId={proposal.stateId!}
                            timelineEvents={proposal.timelineEvents ?? []}
                            stateTransitions={proposal.stateTransitions ?? []}
                            submittedDate={proposal.createdDate!}
                            states={states ?? []}
                            showErrorToast={showErrorToast}
                        />
                        <ProposalCommentsTabContent
                            comments={proposal.comments ?? []}
                            addComment={addNewComment}
                            commentType={CommentTypes.OBSERVATIONS}
                        />
                    </Tab>

                    {isDataReady && proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                        <Tab eventKey={"partnerships"} title={"Parcerias"}>
                            <ProposalStateView
                                isProtocolValidated={proposal.financialComponent?.protocol?.validated}
                                onAdvanceClick={advanceState}
                                currentStateId={proposal.stateId!}
                                timelineEvents={proposal.timelineEvents ?? []}
                                stateTransitions={proposal.stateTransitions ?? []}
                                submittedDate={proposal.createdDate!}
                                states={states ?? []}
                                showErrorToast={showErrorToast}
                            />
                            <PartnershipsTabContent
                                partnerships={proposal.financialComponent!.partnerships!}
                            />
                        </Tab> :
                        <></>
                    }

                    {isDataReady && proposal.type === ResearchTypes.CLINICAL_TRIAL.id &&
                        <Tab eventKey={ProposalTabNames.protocol} title="Protocolo">
                            <ProtocolTabContent
                                saveProtocolComment={updateProtocol}
                                pfcId={proposal.financialComponent?.id}
                                comments={proposal.comments?.filter(value => value.commentType === CommentTypes.PROTOCOL.id) ?? []}
                                setNewComment={(c) => setProposal(updateState("comments", [...proposal.comments!, c]))}
                                protocol={proposal.financialComponent?.protocol}
                            />
                        </Tab>
                    }


                    <Tab eventKey={ProposalTabNames.chronology} title="Cronologia">
                        <div>
                            <ProposalStateView
                                isProtocolValidated={proposal.financialComponent?.protocol!.validated!}
                                onAdvanceClick={advanceState}
                                currentStateId={proposal.stateId!}
                                timelineEvents={proposal.timelineEvents ?? []}
                                stateTransitions={proposal.stateTransitions ?? []}
                                submittedDate={proposal.createdDate!}
                                states={states ?? []}
                                showErrorToast={showErrorToast}
                            />
                            <ProposalTimelineTabContent
                                possibleStates={states ?? []}
                                service={props.proposalService}
                                timelineEvents={proposal.timelineEvents ?? []}
                                setNewTimeLineEvent={handleNewEvent}
                                updateTimelineEvent={handleUpdateEvent}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </Container>
        </React.Fragment>
    )
}
