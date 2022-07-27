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
        console.log("data received to update research: ", data)
        // props.researchService
        //     .updateResearch(data)
        //     .then(setResearch)
    }, [])

    const [selectedTab, setSelectedTab] = useState("research")

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