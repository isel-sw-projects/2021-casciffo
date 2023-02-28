import {MyError} from "../../error-view/MyError";

import {
    DossierModel, PatientVisitsAggregate, ResearchAddenda,
    ResearchFinance, ResearchFinanceEntry,
    ResearchModel, ResearchPatientModel, ResearchPatientVisitsAggregate, ResearchTeamFinanceEntry,
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
import {
    ADDENDA_ID_PARAMETER,
    PATIENT_ID_PARAMETER, ResearchTabNames,
    ResearchTypes,
    SCOPE_PARAMETER,
    TAB_PARAMETER,
    TabPaneScope,
    VISIT_ID_PARAMETER
} from "../../../common/Constants";
import {ResearchVisitDetailsTab} from "../visits/ResearchVisitDetailsTab";
import {useUserAuthContext} from "../../context/UserAuthContext";
import {MyUtil} from "../../../common/MyUtil";
import {toast, ToastContainer} from "react-toastify";
import {ToastMsgContext} from "../../context/ToastMsgContext";
import {ResearchAddendaDetails} from "../addenda/ResearchAddendaDetails";

export function ResearchDetailsPage(props: { researchService: ResearchAggregateService }) {
    const {researchId} = useParams()

    if(researchId == null) {
        throw new MyError("", 400)
    }
    const [selectedTab, setSelectedTab] = useState(ResearchTabNames.research)
    const [tabPaneScope, setTabPaneScope] = useState<TabPaneScope>(TabPaneScope.OVERVIEW)
    const errorHandler = useErrorHandler()
    const errorToast = useCallback( (error: MyError)=> {
        toast.error(error.message)
    }, [])
    const infoToast = useCallback( (msg: string, type: "info" | "success") => {
        if(type === "info") {
            toast.info(msg)
        } else {
            toast.success(msg)
        }
    }, [])

    const userId = useUserAuthContext().userToken?.userId
    if(userId == null) {
        throw new MyError("", 400)
    }

    const [research, setResearch] = useState<ResearchModel>({})
    const [stateChain, setStateChain] = useState<StateModel[]>([])
    const {hash} = useLocation()


    useEffect(() => {
        const params = MyUtil.parseUrlHash(hash)
        const tabParam = params.find(pair => pair.key === TAB_PARAMETER)
        const tab = tabParam && Object.values(ResearchTabNames).find(t => t === tabParam.value) ? tabParam!.value : ResearchTabNames.research
        const scopeParam = params.find(pair => pair.key === SCOPE_PARAMETER)
        if(scopeParam != null && scopeParam.value in TabPaneScope) {
            setTabPaneScope(parseInt(scopeParam.value))
        }
        setSelectedTab(tab)
    }, [hash])

    useEffect(() => {
        props.researchService
            .fetchResearchStateChain()
            .then(setStateChain)
            .catch(errorHandler)
    }, [props.researchService, researchId, errorHandler])

    useEffect(() => {
        props.researchService
            .fetchResearch(researchId!)
            .then(setResearch)
            .catch(errorHandler)
    }, [props.researchService, researchId, errorHandler])


    const updateResearch = useCallback((data: ResearchModel) => {
        props.researchService
            .updateResearch(data)
            .then(setResearch)
            .catch(errorToast)
    }, [errorToast, props.researchService])


    const submitDossier = useCallback((researchId: string) => {
        return (d: DossierModel) => {
            props.researchService
                .addDossierToResearch(researchId, d)
                .then(d => {
                    setResearch(prevState => ({
                        ...prevState,
                        dossiers: [d, ...prevState.dossiers ?? []]
                    }))
                })
                .catch(errorToast)
        }
    }, [errorToast, props.researchService])

    const saveRandomization = useCallback((patients: ResearchPatientModel[]) => {
        props.researchService.saveRandomization(researchId, patients)
            .then(value => setResearch(prevState => ({...prevState, patients: value})))
            .catch(errorToast)
    }, [errorToast, props.researchService, researchId])

    const updateResearchFinance = useCallback((rf: ResearchFinance) => {
        props.researchService.updateResearchFinance(researchId, rf)
            .then(value => setResearch(prevState => ({...prevState, financeComponent: value})))
            .catch(errorToast)
    }, [errorToast, props.researchService, researchId])


    const addPatientAndVisits = useCallback((patientAndVisitsToAdd: PatientVisitsAggregate) => {
        const addVisitsToList = (aggregate: ResearchPatientVisitsAggregate) => {
            if(aggregate.scheduledVisits && aggregate.scheduledVisits.length !== 0)
                setResearch(prevState => ({...prevState, visits: [...prevState.visits || [], ...aggregate.scheduledVisits]}))
        }

        const addPatientToList = (aggregate: ResearchPatientVisitsAggregate) => {
            setResearch(prevState => ({...prevState, patients: [...prevState.patients || [], aggregate.researchPatient]}))
            return aggregate
        }

        props.researchService
            .addPatientAndScheduleVisits(researchId, patientAndVisitsToAdd)
            .then(addPatientToList)
            .then(addVisitsToList)
            .catch(errorToast)
    },[errorToast, props.researchService, researchId])

    const addNewVisit = useCallback((visit: ResearchVisitModel) => {
        const addVisitsToList = (v: ResearchVisitModel[]) => {
            setResearch((prevState => ({...prevState, visits: [...prevState.visits || [], ...v]})))
        }

        props.researchService
            .scheduleVisit(researchId, visit)
            .then(addVisitsToList)
            .catch(errorToast)
    }, [errorToast, props.researchService, researchId])

    const onSaveScientificActivity = useCallback((activity: ScientificActivityModel) => {
        console.log(activity)
        props.researchService.newScientificActivityEntry(researchId!, activity)
            .then(value => setResearch(prevState => ({...prevState, scientificActivities: [value, ...prevState.scientificActivities || []]})))
            .catch(errorToast)
    }, [errorToast, props.researchService, researchId])

    const onCompleteResearch = useCallback(() =>
        props.researchService
            .completeResearch(researchId!)
            .then((answer) => {
                if(answer.success) {
                    setResearch(answer.research!)
                } else {
                    toast.error("Não foi possível completar! Tente refrescar a página.")
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
                    toast.error("Não foi possível cancelar! Tente refrescar a página.")
                }
            })
            .catch(errorHandler)
    ,[errorHandler, props.researchService, researchId, userId])


    const saveResearchFinanceEntry = (entry: ResearchFinanceEntry) => {
        entry.rfcId = research.financeComponent!.id
        props.researchService
            .saveNewFinanceEntry(researchId!, entry)
            .then(dto => {
                setResearch(prevState => ({
                    ...prevState,
                    financeComponent: {
                        ...dto,
                        teamFinanceFlow: prevState.financeComponent!.teamFinanceFlow,
                        monetaryFlow: [dto.newMonetaryEntry!, ...prevState.financeComponent!.monetaryFlow || []]
                    }
                }))
            })
            .catch(errorToast)
    }
    const saveTeamFinanceEntry = (entry: ResearchTeamFinanceEntry) => {
        entry.rfcId = research.financeComponent!.id
        props.researchService
            .saveNewTeamFinanceEntry(researchId!, entry)
            .then(dto => {
                setResearch(prevState => ({
                    ...prevState,
                    financeComponent: {
                        ...dto,
                        teamFinanceFlow: [dto.newTeamFinanceEnty!, ...prevState.financeComponent!.teamFinanceFlow || []],
                        monetaryFlow: prevState.financeComponent!.monetaryFlow
                    }
                }))
            })
            .catch(errorToast)
    }

    const removePatient = (patientProcessNum: string) => {
        props.researchService
            .removeParticipant(researchId, patientProcessNum)
            .then(() => setResearch(prevState => ({...prevState, patients: prevState.patients?.filter(p => p.patient!.processId !== patientProcessNum)})))
            .catch(errorToast)
    }

    const renderPatientOverviewScreen = () => {
        const args = [
            {key: TAB_PARAMETER, value: ResearchTabNames.patients},
            {key: SCOPE_PARAMETER, value: TabPaneScope.OVERVIEW.toString()}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
    }
    const renderPatientAddScreen = () => {
        const args = [
            {key: TAB_PARAMETER, value: ResearchTabNames.patients},
            {key: SCOPE_PARAMETER, value: TabPaneScope.CREATE.toString()}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
    }
    const renderPatientDetailsScreen = (pId: string) => {
        const args = [
            {key: TAB_PARAMETER, value: ResearchTabNames.patients},
            {key: SCOPE_PARAMETER, value: TabPaneScope.DETAILS.toString()},
            {key: PATIENT_ID_PARAMETER, value: pId}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
    }

    const patientSwitchRender = (tab: TabPaneScope) => {
        if(selectedTab !== ResearchTabNames.patients) {
            return <ResearchPatientsTab
                patients={research.patients ?? []}
                onChangeScreenToAddPatient={renderPatientAddScreen}
                onClickToPatientDetails={renderPatientDetailsScreen}
                treatmentBranches={research.treatmentBranches?.split(';') || []}
                saveRandomization={saveRandomization}
                removePatient={removePatient}
            />
        }

        switch (tab) {
            case TabPaneScope.OVERVIEW:
                return <ResearchPatientsTab
                    patients={research.patients ?? []}
                    onChangeScreenToAddPatient={renderPatientAddScreen}
                    onClickToPatientDetails={renderPatientDetailsScreen}
                    treatmentBranches={research.treatmentBranches?.split(';') || []}
                    saveRandomization={saveRandomization}
                    removePatient={removePatient}
                />
            case TabPaneScope.DETAILS:
                return <PatientDetails
                    fetchPatient={props.researchService.fetchResearchPatient}
                    visits={research.visits ?? []}
                    onRenderOverviewClick={renderPatientOverviewScreen}
                    renderVisitDetails={renderVisitsDetailsScreen}
                />
            case TabPaneScope.CREATE:
                return <AddNewPatient
                    team={research.investigationTeam!}
                    //if passing the direct props.researchService.searchPatientsByProcessId function,
                    // context capture is lost from the service
                    // resulting in undefined properties when the services access "this".property
                    searchByProcessId={pId => {return props.researchService.searchPatientsByProcessId(pId)}}
                    onRenderOverviewClick={renderPatientOverviewScreen}
                    onSavePatientAndVisits={addPatientAndVisits}
                />
            default:
                throw new MyError("Illegal patient tab screen", 400)
        }
    }



    const renderVisitsOverviewScreen = () => {
        const args = [
            {key: TAB_PARAMETER, value: ResearchTabNames.visits},
            {key: SCOPE_PARAMETER, value: TabPaneScope.OVERVIEW.toString()}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
    }

    const renderVisitsDetailsScreen = (vId: string) => {
        const args = [
            {key: VISIT_ID_PARAMETER, value: vId},
            {key: TAB_PARAMETER, value: ResearchTabNames.visits},
            {key: SCOPE_PARAMETER, value: TabPaneScope.DETAILS.toString()}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
    }


    const visitSwitchRender = (tab: TabPaneScope) => {
        if(selectedTab !== ResearchTabNames.visits)
            return <ResearchVisitsTab visits={research.visits || []}
                                      onAddVisit={addNewVisit}
                                      renderDetails={renderVisitsDetailsScreen}
                                      researchTeam={research.investigationTeam || []}
                                      patients={research.patients || []}
            />

        switch (tab) {
            case TabPaneScope.OVERVIEW:
                return <ResearchVisitsTab visits={research.visits || []}
                                          onAddVisit={addNewVisit}
                                          renderDetails={renderVisitsDetailsScreen}
                                          researchTeam={research.investigationTeam || []}
                                          patients={research.patients || []}
                />
            case TabPaneScope.DETAILS:
                return <ResearchVisitDetailsTab service={props.researchService}
                                                onRenderOverviewClick={renderVisitsOverviewScreen}
                                                onRenderPatientDetails={renderPatientDetailsScreen}
                />
            default:
                throw new MyError("Illegal visits tab screen", 400)
        }
    }

    const createAddenda = (file: File) => {
        props.researchService
            .uploadAddendaFile(researchId!, file)
            .then(value => {
                setResearch(prevState => {
                    const newAddendas = [...prevState.addendas ?? [], value.data]
                    return {
                        ...prevState,
                        addendas: newAddendas
                    }
                })
            })
    }

    const downloadAddendaFile = async (addendaId: string) => {
        await props.researchService.downloadAddendaFile(researchId, addendaId)
    }

    const renderAddendaOverviewScreen = (modifiedAddenda: ResearchAddenda) => {
        setResearch(prevState => {
            const newAddendas = prevState.addendas!.map(a => a.id === modifiedAddenda.id ? modifiedAddenda : a)
            return {
                ...prevState,
                addendas: newAddendas
            }
        })
        const args = [
            {key: TAB_PARAMETER, value: ResearchTabNames.addenda},
            {key: SCOPE_PARAMETER, value: TabPaneScope.OVERVIEW.toString()}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
    }

    const renderAddendaDetailsScreen = (aId: string) => {
        const args = [
            {key: ADDENDA_ID_PARAMETER, value: aId},
            {key: TAB_PARAMETER, value: ResearchTabNames.addenda},
            {key: SCOPE_PARAMETER, value: TabPaneScope.DETAILS.toString()}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
    }

    const addendaSwitchRender = (tab: TabPaneScope) => {
        if(selectedTab !== ResearchTabNames.addenda)
            return <ResearchAddendaTab
                    addendas={research.addendas ?? []}
                    renderDetails={renderAddendaDetailsScreen}
                    createAddenda={createAddenda}
                    downloadAddendaFile={downloadAddendaFile}
                />

        switch (tab) {
            case TabPaneScope.OVERVIEW:
                return <ResearchAddendaTab
                            addendas={research.addendas ?? []}
                            renderDetails={renderAddendaDetailsScreen}
                            createAddenda={createAddenda}
                            downloadAddendaFile={downloadAddendaFile}/>
            case TabPaneScope.DETAILS:
                return <ResearchAddendaDetails
                            service={props.researchService}
                            onRenderOverviewClick={renderAddendaOverviewScreen}
                />
            default:
                throw new MyError("Illegal addenda tab screen", 400)
        }
    }

    const navigate = useNavigate()
    const selectTab = (tab:string | null) => {
        const args = [
            {key: TAB_PARAMETER, value: tab || ResearchTabNames.research},
            {key: SCOPE_PARAMETER, value: TabPaneScope.OVERVIEW.toString()}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
        // setSelectedTab(tab!);
        // if(tab === 'patients' && patientViewTab !== PatientViewTab.OVERVIEW) {
        //      renderPatientOverviewScreen()
        // }
    }


    return (
        <ToastMsgContext.Provider value={
            {
                showErrorToastMsg: errorToast,
                showToastMsg: infoToast
            }
        }>
            <Container>
                <ToastContainer/>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={selectedTab}
                    onSelect={selectTab}
                    className="mb-3 justify-content-evenly"
                >
                    <Tab eventKey={ResearchTabNames.research} title={"Ensaio Clínico"}>
                        <ResearchDetailsTab
                            stateChain={stateChain}
                            research={research}
                            updateResearch={updateResearch}
                            addDossier={submitDossier(researchId)}
                            onCancel={onCancelResearch}
                            onComplete={onCompleteResearch}/>

                    </Tab>
                    <Tab eventKey={ResearchTabNames.addenda} title={"Adendas"}>
                        {addendaSwitchRender(tabPaneScope)}
                    </Tab>
                    <Tab eventKey={ResearchTabNames.activities} title={"Atividades científicas"}>
                        <ResearchStates
                            states={stateChain}
                            stateTransitions={research.stateTransitions ?? []}
                            currentState={research.state}
                            createdDate={research.startDate ?? ""}
                            canceledReason={research.canceledReason}
                            canceledBy={research.canceledBy}
                        />
                        <ResearchScientificActivitiesTab
                            onSaveActivity={onSaveScientificActivity}
                            scientificActivities={research.scientificActivities || []}/>

                    </Tab>
                    <Tab eventKey={ResearchTabNames.visits} title={"Visitas"}>
                        <ResearchStates
                            states={stateChain}
                            stateTransitions={research.stateTransitions ?? []}
                            currentState={research.state}
                            createdDate={research.startDate ?? ""}
                            canceledReason={research.canceledReason}
                            canceledBy={research.canceledBy}
                        />
                        {visitSwitchRender(tabPaneScope)}

                    </Tab>
                    <Tab eventKey={ResearchTabNames.patients} title={"Pacientes"}>
                        <ResearchStates
                            states={stateChain}
                            stateTransitions={research.stateTransitions ?? []}
                            currentState={research.state}
                            createdDate={research.startDate ?? ""}
                            canceledReason={research.canceledById}
                            canceledBy={research.canceledBy}
                        />
                        {patientSwitchRender(tabPaneScope)}

                    </Tab>
                    {
                        research.type === ResearchTypes.CLINICAL_TRIAL.id &&
                        <Tab eventKey={ResearchTabNames.finance} title={"Financiamento"}>
                            <ResearchStates
                                states={stateChain}
                                stateTransitions={research.stateTransitions ?? []}
                                currentState={research.state}
                                createdDate={research.startDate ?? ""}
                                canceledReason={research.canceledReason}
                                canceledBy={research.canceledBy}
                            />
                            {research.financeComponent &&
                                <ResearchFinanceTab
                                    numOfPatients={research.patients?.length ?? 0}
                                    onUpdateResearch={updateResearchFinance}
                                    researchTeam={research.investigationTeam || []}
                                    researchFinance={research.financeComponent}
                                    researchService={props.researchService}
                                    onNewTeamEntry={saveTeamFinanceEntry}
                                    onNewFinanceEntry={saveResearchFinanceEntry}
                                />
                            }
                        </Tab>
                    }
                </Tabs>
            </Container>
        </ToastMsgContext.Provider>
    )
}
