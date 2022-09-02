import {MyError} from "../../error-view/MyError";
import {
    DossierModel,
    ResearchModel,
    ResearchVisitModel,
    ScientificActivityModel
} from "../../../model/research/ResearchModel";
import {ResearchDetailsTab} from "./ResearchDetailsTab";
import {PatientDetails} from "../patients/PatientDetails";
import {ResearchFinanceTab} from "../finance/ResearchFinanceTab";
import {ResearchPatientsTab} from "../patients/ResearchPatientsTab";
import {ResearchVisitsTab} from "../visits/ResearchVisitsTab";
import {ResearchAddendaTab} from "./ResearchAddendaTab";
import {AddNewPatient} from "../patients/AddNewPatient";
import {Container, Tab, Tabs} from "react-bootstrap";
import {ResearchAggregateService} from "../../../services/ResearchAggregateService";
import {useCallback, useEffect, useState} from "react";
import {useErrorHandler} from "react-error-boundary";
import {StateModel} from "../../../model/state/StateModel";
import {ResearchScientificActivitiesTab} from "../scientic-activities/ResearchScientificActivitiesTab";
import {ResearchStates} from "./ResearchStates";
import {useParams} from "react-router-dom";
import {PatientViewTab, VisitsViewTab} from "../../../common/Constants";
import {ResearchVisitDetailsTab} from "../visits/ResearchVisitDetailsTab";


export function ResearchDetails(props: { researchService: ResearchAggregateService }) {
    const {researchId} = useParams()
    //todo may have to place into a useEffect, but since it's just a simple check idk if it's worth the extra trouble
    if(researchId == null) {
        throw new MyError("", 400)
    }
    const errorHandler = useErrorHandler()
    // const ResearchDetailsContext = createContext({research: {}, setResearch: (r: ResearchModel): void => {}})

    const [research, setResearch] = useState<ResearchModel>({})
    const [stateChain, setStateChain] = useState<StateModel[]>([])

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

    const [selectedTab, setSelectedTab] = useState("research")

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
                    onRenderOverviewClick={renderPatientOverviewScreen}/>
            case PatientViewTab.OVERVIEW:
                return <ResearchPatientsTab
                    patients={research.patients ?? []}
                    onChangeScreenToAddPatient={renderPatientAddScreen}
                    onClickToPatientDetails={renderPatientDetailsScreen}/>
            default:
                throw new MyError("Illegal patient tab screen", 400)
        }
    }

    const [visitsViewTab, setVisitsViewTab] = useState<VisitsViewTab>(VisitsViewTab.OVERVIEW)


    const addNewVisit = useCallback((visit: ResearchVisitModel) => {
        const addVisitToList = (v: ResearchVisitModel) => {
            setResearch(prevState => ({...prevState, visits: [...prevState.visits || [], v]}))
        }

        props.researchService
            .scheduleVisit(researchId, visit)
            .then(addVisitToList)
    },[props.researchService, researchId])


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
                />
            default:
                throw new MyError("Illegal visits tab screen", 400)
        }
    }

    const selectTab = (tab:string | null) => {
        setSelectedTab(tab!);
        if(tab === 'patients' && patientViewTab !== PatientViewTab.OVERVIEW) {
             renderPatientOverviewScreen()
        }
    }
    
    const onSaveActivity = useCallback((activity: ScientificActivityModel) => {
        props.researchService.newScientificActivityEntry(researchId!, activity)
            .then(value => setResearch(prevState => ({...prevState, scientificActivities: [value, ...prevState.scientificActivities || []]})))
            .catch(errorHandler)
    }, [errorHandler, props.researchService, researchId])

    return (
        // <ResearchDetailsContext.Provider value={re}>
            <Container>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={selectedTab}
                    onSelect={selectTab}
                    className="mb-3 justify-content-evenly"
                >
                    <Tab eventKey={"research"} title={"Ensaio Clínico"}>
                        <ResearchDetailsTab
                            stateChain={stateChain}
                            research={research}
                            updateResearch={updateResearch}
                            addDossier={submitDossier(researchId)}/>

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
                        <ResearchScientificActivitiesTab onSaveActivity={onSaveActivity} scientificActivities={research.visits || []}/>

                    </Tab>
                    <Tab eventKey={"visits"} title={"Visitas"}>
                        <ResearchStates
                            states={stateChain}
                            stateTransitions={research.stateTransitions ?? []}
                            currentStateId={research.stateId ?? ""}
                            createdDate={research.startDate ?? ""}
                        />
                        {visitSwitchRender(visitsViewTab)}

                    </Tab>
                    <Tab eventKey={"patients"} title={"Pacientes"}>
                        <ResearchStates
                            states={stateChain}
                            stateTransitions={research.stateTransitions ?? []}
                            currentStateId={research.stateId ?? ""}
                            createdDate={research.startDate ?? ""}
                        />
                        {patientSwitchRender(patientViewTab)}

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
        // </ResearchDetailsContext.Provider>
    )
}
