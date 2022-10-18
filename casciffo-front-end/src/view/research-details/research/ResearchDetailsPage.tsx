import {MyError} from "../../error-view/MyError";

import {
    DossierModel,
    PatientModel,
    ResearchModel,
    ResearchVisitModel,
    ScientificActivityModel
} from "../../../model/research/ResearchModel";

import {ResearchDetailsTab} from "./ResearchDetailsTab";
import {PatientDetails} from "../patients/PatientDetails";
import {ResearchFinanceTab} from "../finance/ResearchFinanceTab";
import {ResearchPatientsTab} from "../patients/ResearchPatientsTab";
import {ResearchVisitsTab} from "../visits/ResearchVisitsTab";
import {ResearchAddendaTab} from "../addenda/ResearchAddendaTab";
import {AddNewPatient} from "../patients/AddNewPatient";
import {Container, Tab, Tabs} from "react-bootstrap";
import {ResearchAggregateService} from "../../../services/ResearchAggregateService";
import {useCallback, useEffect, useState} from "react";
import {useErrorHandler} from "react-error-boundary";
import {StateModel} from "../../../model/state/StateModel";
import {ResearchScientificActivitiesTab} from "../scientic-activities/ResearchScientificActivitiesTab";
import {ResearchStates} from "./ResearchStates";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {AddendaViewTab, PatientViewTab, ResearchTypes, TAB_PARAMETER, VisitsViewTab} from "../../../common/Constants";
import {ResearchVisitDetailsTab} from "../visits/ResearchVisitDetailsTab";
import {useUserAuthContext} from "../../context/UserAuthContext";
import {MyUtil} from "../../../common/MyUtil";


const TAB_NAMES = {
    research: "research",
    addenda: "addenda",
    activities: "activities",
    visits: "visits",
    patients: "patients",
    finance: "finance"
}

export function ResearchDetailsPage(props: { researchService: ResearchAggregateService }) {
    const {researchId} = useParams()

    if(researchId == null) {
        throw new MyError("", 400)
    }
    const [selectedTab, setSelectedTab] = useState("research")
    const errorHandler = useErrorHandler()
    // const ResearchDetailsContext = createContext({research: {}, setResearch: (r: ResearchModel): void => {}})

    const userId = useUserAuthContext().userToken?.userId
    if(userId == null) {
        throw new MyError("", 400)
    }
    const [research, setResearch] = useState<ResearchModel>({})
    const [stateChain, setStateChain] = useState<StateModel[]>([])
    const {hash} = useLocation()

    useEffect(() => {
        const params = MyUtil.parseUrlHash(hash).find(pair => pair.key === TAB_PARAMETER)
        const tab = params && params.value in TAB_NAMES ? params!.value : TAB_NAMES.research
        setSelectedTab(tab)
    }, [hash])

    useEffect(() => {
        props.researchService
            .fetchResearchStateChain()
            .then(setStateChain, errorHandler)
    }, [props.researchService, researchId, errorHandler])

    useEffect(() => {
        props.researchService
            .fetchResearch(researchId!)
            .then(value => {
                console.log(value)
                return value
            })
            .then(setResearch, errorHandler)
    }, [props.researchService, researchId, errorHandler])


    const updateResearch = useCallback((data: ResearchModel) => {
        props.researchService
            .updateResearch(data)
            .then(setResearch)
            .catch(errorHandler)
    }, [errorHandler, props.researchService])


    const submitDossier = useCallback((researchId: string) => {
        return (d: DossierModel) => {
            // console.log("calling research service with id: ", researchId, " and data: ", d)
            props.researchService
                .addDossierToResearch(researchId, d)
                .then(d => {
                    setResearch(prevState => ({
                        ...prevState,
                        dossiers: [d, ...prevState.dossiers ?? []]
                    }))
                })
                .catch(errorHandler)
        }
    }, [errorHandler, props.researchService])

    const saveRandomization = useCallback((patients: PatientModel[]) => {
        props.researchService.saveRandomization(researchId, patients)
            .then(value => setResearch(prevState => ({...prevState, patients: value})))
    }, [props.researchService, researchId])




    const changeTabAndRenderPatientDetails = () => {
        //TODO MAYBE MOVE THE NAVIGATE PORTION HERE, BASICALLY ALTER URL HERE
        setPatientViewTab(PatientViewTab.DETAILS)
        setSelectedTab(TAB_NAMES.patients)
    }

    const changeTabAndRenderVisitDetails = () => {
        setVisitsViewTab(VisitsViewTab.DETAILS)
        setSelectedTab(TAB_NAMES.visits)
    }


    const [patientViewTab, setPatientViewTab] = useState<PatientViewTab>(PatientViewTab.OVERVIEW)

    const renderPatientOverviewScreen = () => setPatientViewTab(PatientViewTab.OVERVIEW)
    const renderPatientAddScreen = () => setPatientViewTab(PatientViewTab.CREATE)
    const renderPatientDetailsScreen = () => setPatientViewTab(PatientViewTab.DETAILS)

    const patientSwitchRender = (tab: PatientViewTab) => {
        switch (tab) {
            case PatientViewTab.CREATE:
                return <AddNewPatient
                    team={research.investigationTeam!}
                    searchByProcessId={props.researchService.searchPatientsByProcessId}
                    onRenderOverviewClick={renderPatientOverviewScreen}/>
            case PatientViewTab.DETAILS:
                return <PatientDetails
                    fetchPatient={props.researchService.fetchResearchPatient}
                    visits={research.visits ?? []}
                    onRenderOverviewClick={renderPatientOverviewScreen}
                    renderVisitDetails={changeTabAndRenderVisitDetails}
                />
            case PatientViewTab.OVERVIEW:
                return <ResearchPatientsTab
                    patients={research.patients ?? []}
                    onChangeScreenToAddPatient={renderPatientAddScreen}
                    onClickToPatientDetails={renderPatientDetailsScreen}
                    treatmentBranches={research.treatmentBranches?.split(';') || []}
                    saveRandomization={saveRandomization}/>
            default:
                throw new MyError("Illegal patient tab screen", 400)
        }
    }

    const addNewVisit = useCallback((visit: ResearchVisitModel) => {
        const addVisitToList = (v: ResearchVisitModel) => {
            setResearch(prevState => ({...prevState, visits: [...prevState.visits || [], v]}))
        }

        props.researchService
            .scheduleVisit(researchId, visit)
            .then(addVisitToList)
    },[props.researchService, researchId])

    const [visitsViewTab, setVisitsViewTab] = useState<VisitsViewTab>(VisitsViewTab.OVERVIEW)

    const renderVisitsOverviewScreen = () => setVisitsViewTab(VisitsViewTab.OVERVIEW)
    const renderVisitsDetailsScreen = () => setVisitsViewTab(VisitsViewTab.DETAILS)


    const visitSwitchRender = (tab: VisitsViewTab) => {
        switch (tab) {
            case VisitsViewTab.OVERVIEW:
                return <ResearchVisitsTab visits={research.visits || []}
                                          onAddVisit={addNewVisit}
                                          renderDetails={renderVisitsDetailsScreen}
                />
            case VisitsViewTab.DETAILS:
                return <ResearchVisitDetailsTab service={props.researchService}
                                                onRenderOverviewClick={renderVisitsOverviewScreen}
                                                onRenderPatientDetails={changeTabAndRenderPatientDetails}
                />
            default:
                throw new MyError("Illegal visits tab screen", 400)
        }
    }

    const [addendaViewTab, setAddendaViewTab] = useState<AddendaViewTab>(AddendaViewTab.OVERVIEW)

    const renderAddendaOverviewScreen = () => setAddendaViewTab(AddendaViewTab.OVERVIEW)
    const renderAddendaDetailsScreen = () => setAddendaViewTab(AddendaViewTab.DETAILS)

    const addendaSwitchRender = (tab: AddendaViewTab) => {
        switch (tab) {
            case AddendaViewTab.OVERVIEW:
                return <ResearchAddendaTab
                            addendas={research.addendas ?? []}
                            renderDetails={renderAddendaDetailsScreen}
                />
            // case AddendaViewTab.DETAILS:
            //     return <ResearchAddendaDetails service={props.researchService}
            //                                     onRenderOverviewClick={renderAddendaOverviewScreen}
            //     />
            default:
                throw new MyError("Illegal addenda tab screen", 400)
        }
    }

    const navigate = useNavigate()
    const selectTab = (tab:string | null) => {
        console.log("NAVIGATING TO " + tab)
        navigate(`#${TAB_PARAMETER}=${tab}`)
        // setSelectedTab(tab!);
        // if(tab === 'patients' && patientViewTab !== PatientViewTab.OVERVIEW) {
        //      renderPatientOverviewScreen()
        // }
    }
    
    const onSaveScientificActivity = useCallback((activity: ScientificActivityModel) => {
        props.researchService.newScientificActivityEntry(researchId!, activity)
            .then(value => setResearch(prevState => ({...prevState, scientificActivities: [value, ...prevState.scientificActivities || []]})))
            .catch(errorHandler)
    }, [errorHandler, props.researchService, researchId])

    const onCompleteResearch = useCallback(() =>
        props.researchService
            .completeResearch(researchId!)
            .then((answer) => {
                if(answer.success) {
                    setResearch(answer.research!)
                } else {
                    alert("Failure to complete.")
                }
            })
            .catch(errorHandler)
        , [errorHandler, props.researchService, researchId])

    const onCancelResearch = useCallback((reason: string) =>
        props.researchService
            .cancelResearch(researchId!, reason, userId)
            .then((answer) => {
                if(answer.success) {
                    setResearch(answer.research!)
                } else {
                    alert("Failure to cancel.")
                }
            })
            .catch(errorHandler)
    ,[errorHandler, props.researchService, researchId, userId])

    return (
        // <ResearchDetailsContext.Provider value={re}>
            <Container>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={selectedTab}
                    onSelect={selectTab}
                    className="mb-3 justify-content-evenly"
                >
                    <Tab eventKey={TAB_NAMES.research} title={"Ensaio Clínico"}>
                        <ResearchDetailsTab
                            stateChain={stateChain}
                            research={research}
                            updateResearch={updateResearch}
                            addDossier={submitDossier(researchId)}
                            onCancel={onCancelResearch}
                            onComplete={onCompleteResearch}/>

                    </Tab>
                    <Tab eventKey={TAB_NAMES.addenda} title={"Adendas"}>
                        {addendaSwitchRender(addendaViewTab)}
                    </Tab>
                    <Tab eventKey={TAB_NAMES.activities} title={"Atividades científicas"}>
                        <ResearchStates
                            states={stateChain}
                            stateTransitions={research.stateTransitions ?? []}
                            currentStateId={research.stateId ?? ""}
                            createdDate={research.startDate ?? ""}
                            canceledReason={research.canceledReason}
                        />
                        <ResearchScientificActivitiesTab onSaveActivity={onSaveScientificActivity} scientificActivities={research.visits || []}/>

                    </Tab>
                    <Tab eventKey={TAB_NAMES.visits} title={"Visitas"}>
                        <ResearchStates
                            states={stateChain}
                            stateTransitions={research.stateTransitions ?? []}
                            currentStateId={research.stateId ?? ""}
                            createdDate={research.startDate ?? ""}
                            canceledReason={research.canceledReason}
                        />
                        {visitSwitchRender(visitsViewTab)}

                    </Tab>
                    <Tab eventKey={TAB_NAMES.patients} title={"Pacientes"}>
                        <ResearchStates
                            states={stateChain}
                            stateTransitions={research.stateTransitions ?? []}
                            currentStateId={research.stateId ?? ""}
                            createdDate={research.startDate ?? ""}
                            canceledReason={research.canceledById}
                        />
                        {patientSwitchRender(patientViewTab)}

                    </Tab>
                    {
                        research.type === ResearchTypes.CLINICAL_TRIAL.id &&
                        <Tab eventKey={TAB_NAMES.finance} title={"Financiamento"}>
                            <ResearchStates
                                states={stateChain}
                                stateTransitions={research.stateTransitions ?? []}
                                currentStateId={research.stateId ?? ""}
                                createdDate={research.startDate ?? ""}
                                canceledReason={research.canceledReason}
                            />
                            {research.financeComponent &&
                                <ResearchFinanceTab
                                    numOfPatients={research.patients?.length ?? 0}
                                    onUpdateResearch={updateResearch}
                                    researchFinance={research.financeComponent}
                                    researchService={props.researchService}/>
                            }
                        </Tab>
                    }
                </Tabs>
            </Container>
        // </ResearchDetailsContext.Provider>
    )
}
