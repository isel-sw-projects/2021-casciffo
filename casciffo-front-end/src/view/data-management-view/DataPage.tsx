import React, {useCallback, useEffect, useState} from "react";
import {ConstantsService} from "../../services/ConstantsService";
import {toast, ToastContainer} from "react-toastify";
import {Container, Tab, Tabs} from "react-bootstrap";
import {DataTypesTabNames, TAB_PARAMETER} from "../../common/Constants";
import {MyUtil} from "../../common/MyUtil";
import {useLocation, useNavigate} from "react-router-dom";
import {PathologyTab} from "./PathologyTab";
import {PathologyModel} from "../../model/proposal-constants/PathologyModel";
import {ServiceTypeModel} from "../../model/proposal-constants/ServiceTypeModel";
import {TherapeuticAreaModel} from "../../model/proposal-constants/TherapeuticAreaModel";
import {ServiceTypeTab} from "./ServiceTypeTab";
import {TherapeuticAreaTab} from "./TherapeuticAreaTab";
import {PatientListTab} from "./PatientListTab";
import {PatientService} from "../../services/PatientService";
import {MyError} from "../error-view/MyError";


type Props = {
    constantsService: ConstantsService
    patientService: PatientService
}

export function DataPage(props: Props) {

    const [selectedTab, setSelectedTab] = useState("service")
    const errorToast = useCallback( (error: MyError)=> toast.error(error.message), [])

    useEffect(() => {
        document.title = MyUtil.DATA_TITLE
    })


    const {hash} = useLocation()
    const navigate = useNavigate()
    const defaultTab = DataTypesTabNames.serviceType

    
    useEffect(() => {
        const params = MyUtil.parseUrlHash(hash).find(p => p.key === TAB_PARAMETER)
        const tabParam = ( params && params.value ) || defaultTab

        setSelectedTab(tabParam)
    }, [defaultTab, hash])

    const onSelectTab = (tab: string | null) => {
        const args = [
            {key: TAB_PARAMETER, value: tab || defaultTab}
        ]
        const path = MyUtil.formatUrlHash(args)
        navigate(path)
    }


    const [pathologies, setPathologies] = useState<PathologyModel[]>([])
    const [serviceTypes, setServiceTypes] = useState<ServiceTypeModel[]>([])
    const [therapeuticAreas, setTherapeuticAreas] = useState<TherapeuticAreaModel[]>([])

    useEffect(() => {
        props.constantsService
            .fetchConstants()
            .then(values => {
                setPathologies(values.pathologies)
                setServiceTypes(values.serviceTypes)
                setTherapeuticAreas(values.therapeuticAreas)
            })
            .catch(errorToast)
    }, [errorToast, props.constantsService])

    const saveNewPathology = (pathology: PathologyModel) => {
        props.constantsService
            .savePathology(pathology)
            .then(value => setPathologies(prevState => {
                return [...prevState, value]
            }))
            .catch(errorToast)
    }
    const updatePathology = (pathology: PathologyModel) => {
        props.constantsService
            .savePathology(pathology)
            .then(value => {
                setPathologies(prevState => {
                    return prevState.map(p => p.id === value.id ? value : p)
                })
            })
            .catch(errorToast)
    }
    const deletePathology = (pathologyId: number) => {
        props.constantsService
            .deletePathology(pathologyId.toString())
            .then(_ => {
                setPathologies(prevState => {
                    const index = prevState.findIndex(p => p.id === pathologyId)
                    return MyUtil.removeIndexOf(prevState, index)
                })
            })
            .catch(errorToast)
    }
    const saveNewServiceType = (serviceType: ServiceTypeModel) => {
        props.constantsService
            .saveServiceType(serviceType)
            .then(value => setServiceTypes(prevState => {
                return [...prevState, value]
            }))
            .catch(errorToast)
    }
    const updateServiceType = (serviceType: ServiceTypeModel) => {
        props.constantsService
            .saveServiceType(serviceType)
            .then(value => {
                setServiceTypes(prevState => {
                    return prevState.map(s => s.id === value.id ? value : s)
                })
            })
    }
    const deleteServiceType = (serviceTypeId: number) => {
        props.constantsService
            .deleteServiceType(serviceTypeId.toString())
            .then(_ => {
                setServiceTypes(prevState => prevState.filter(s => s.id !== serviceTypeId))
            })
    }
    const saveNewTherapeuticArea = (therapeuticArea: TherapeuticAreaModel) => {
        props.constantsService
            .saveTherapeuticArea(therapeuticArea)
            .then(value => setPathologies(prevState => {
                return [...prevState, value]
            }))
    }
    const updateTherapeuticArea = (therapeuticArea: TherapeuticAreaModel) => {
        props.constantsService
            .saveTherapeuticArea(therapeuticArea)
            .then(value => {
                setTherapeuticAreas(prevState => {
                    return prevState.map(t => t.id === value.id ? value : t)
                })
            })
    }
    const deleteTherapeuticArea = (therapeuticAreaId: number) => {
        props.constantsService
            .deleteTherapeuticArea(therapeuticAreaId.toString())
            .then(_ => {
                setPathologies(prevState => {
                    const index = prevState.findIndex(p => p.id === therapeuticAreaId)
                    return MyUtil.removeIndexOf(prevState, index)
                })
            })
    }
    
    return <React.Fragment>
        <ToastContainer/>
        <Container>
            <Tabs
                id="data-tabs"
                activeKey={selectedTab}
                onSelect={onSelectTab}
                className="mb-3 justify-content-evenly"
            >
                <Tab eventKey={DataTypesTabNames.serviceType} title={"Serviços"}>
                    <ServiceTypeTab
                        serviceTypes={serviceTypes}
                        saveServiceType={saveNewServiceType}
                        updateServiceType={updateServiceType}
                        deleteServiceType={deleteServiceType}
                    />
                </Tab>
                <Tab eventKey={DataTypesTabNames.pathology} title={"Patologias"}>
                    <PathologyTab
                        pathologies={pathologies}
                        savePathology={saveNewPathology}
                        updatePathology={updatePathology}
                        deletePathology={deletePathology}
                    />
                </Tab>
                <Tab eventKey={DataTypesTabNames.therapeuticArea} title={"Áreas terapeuticas"}>
                    <TherapeuticAreaTab
                        therapeuticAreas={therapeuticAreas}
                        saveTherapeuticArea={saveNewTherapeuticArea}
                        updateTherapeuticArea={updateTherapeuticArea}
                        deleteTherapeuticArea={deleteTherapeuticArea}
                    />
                </Tab>
                <Tab eventKey={DataTypesTabNames.patients} title={"Pacientes"}>
                    <PatientListTab
                        service={props.patientService}
                        errorToast={errorToast}
                    />
                </Tab>
            </Tabs>
        </Container>
    </React.Fragment>
}


// function PatientSwitchRender (props: { selectedTab: string, tab: TabPaneScope, service: PatientService }) {
//     if(props.selectedTab !== DataTypesTabNames.patients)
//         return <PatientListTab visits={research.visits || []}
//                                onAddVisit={addNewVisit}
//                                renderDetails={renderVisitsDetailsScreen}
//                                researchTeam={research.investigationTeam || []}
//                                patients={research.patients || []}
//         />
//
//     switch (tab) {
//         case TabPaneScope.OVERVIEW:
//             return <PatientListTab visits={research.visits || []}
//                                    onAddVisit={addNewVisit}
//                                    renderDetails={renderVisitsDetailsScreen}
//                                    researchTeam={research.investigationTeam || []}
//                                    patients={research.patients || []}
//             />
//         case TabPaneScope.DETAILS:
//             // return <PatientDetails service={props.researchService}
//             //                         onRenderOverviewClick={renderVisitsOverviewScreen}
//             //                         onRenderPatientDetails={renderPatientDetailsScreen}
//             // />
//             break
//         default:
//             throw new MyError("Illegal visits tab screen", 400)
//     }
// }

