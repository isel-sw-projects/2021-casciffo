import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import {Container, Tab, Tabs} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {DossierModel, ResearchModel} from "../../model/research/ResearchModel";
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

export function ResearchDetails(props: { researchService: ResearchAggregateService }) {

    const {researchId} = useParams()
    //todo may have to place into a useEffect, but since it's just a simple check idk if it's worth the extra trouble
    if(researchId == null) {
        throw new MyError("", 400)
    }
    const errorHandler = useErrorHandler()

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
            .then(setResearch, errorHandler)
    }, [props.researchService, researchId, errorHandler])


    const updateResearch = useCallback((data: ResearchModel) => {
        props.researchService
            .updateResearch(data)
            .then(setResearch)
    }, [props.researchService])

    const [selectedTab, setSelectedTab] = useState("research")

    const submitDossier = useCallback((researchId: string) => {
        return (d: DossierModel) => {
            console.log("calling research service with id: ", researchId, " and data: ", d)
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