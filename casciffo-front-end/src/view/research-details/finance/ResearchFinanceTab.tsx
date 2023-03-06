import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row, TabPane, Tabs} from "react-bootstrap";
import {ResearchTeamFinanceEntriesTab} from "./ResearchTeamFinanceEntriesTab";
import {ResearchFinanceEntriesTab} from "./ResearchFinanceEntriesTab";
import {ResearchAggregateService} from "../../../services/ResearchAggregateService";
import {
    ResearchFinance,
    ResearchFinanceEntry,
    ResearchTeamFinanceEntry
} from "../../../model/research/ResearchModel";
import {FormInputHelper} from "../../components/FormInputHelper";
import {useUserAuthContext} from "../../context/UserAuthContext";
import {Roles} from "../../../model/role/Roles";
import {TeamInvestigatorModel} from "../../../model/user/TeamInvestigatorModel";
import {Divider} from "@mui/material";

type ResearchFinanceProps = {
    researchService: ResearchAggregateService
    onUpdateResearch: (rf: ResearchFinance) => void
    researchFinance: ResearchFinance
    researchTeam: TeamInvestigatorModel[]
    numOfPatients: number
    onNewTeamEntry: (entry: ResearchTeamFinanceEntry) => void
    onNewFinanceEntry: (entry: ResearchFinanceEntry) => void
}

export function ResearchFinanceTab(props: ResearchFinanceProps) {
    // const {researchId} = useParams()

    const [selectedFinanceTab, setSelectedFinanceTab] = useState("research-finance")
    const selectTab = (tab:string | null) => {
        setSelectedFinanceTab(tab!)
    }

    const [numOfPatients, setNumOfPatients] = useState(0)

    useEffect(() => {
        setNumOfPatients(props.numOfPatients)
    }, [props.numOfPatients])

    const [researchFinance, setResearchFinance] = useState<ResearchFinance>({})
    const [prevResearchFinance, setPrevResearchFinance] = useState<ResearchFinance>({})
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        setResearchFinance(props.researchFinance)
        setPrevResearchFinance(props.researchFinance)
    }, [props.researchFinance])

    const userToken = useUserAuthContext()

    const canShowEdit = userToken.userToken?.roles?.some(r => r === Roles.SUPERUSER.id || r === Roles.FINANCE.id)

    const toggleEditing = () => setIsEditing(prevState => !prevState)

    const updateResearchFinance = (e: any) => {
        const key = e.target.name as keyof ResearchFinance
        const value = e.target.value
        setResearchFinance(prevState => ({...prevState, [key]: value}))
    }
    
    const saveResearchFinance = (rf: ResearchFinance) => {
        setIsEditing(false)
        props.onUpdateResearch(rf)
    }
    
    const cancelChanges = () => {
        setIsEditing(false)
        setResearchFinance(prevResearchFinance)
    }

    const updateGeneralFinance = (entry: ResearchFinanceEntry) => {
        props.onNewFinanceEntry(entry)
    }

    const updateTeamFinance = (entry: ResearchTeamFinanceEntry) => {
        props.onNewTeamEntry(entry)
    }

    return <React.Fragment>
        <Container className={"border-top border-2 border-secondary"}>
            <form>
                <Container className={"mt-3 mt-md-3 mb-3 mb-md-3"}>
                    { canShowEdit && (
                        isEditing
                            ? <>
                            <Row>
                                <Col>
                                    <Button className={"me-2 me-md-2 ms-2 ms-md-2"} variant={"outline-primary"} onClick={() => saveResearchFinance(researchFinance)}>Guardar Alterações</Button>
                                </Col>
                                <Col/>
                                <Col>
                                    <Button className={"me-2 me-md-2 ms-2 ms-md-2"} variant={"outline-danger"} onClick={cancelChanges}>Cancelar</Button>
                                </Col>
                                <Col/>
                                <Col/>
                            </Row>
                            </>
                            : <Button variant={"outline-primary"} onClick={toggleEditing}>Editar</Button>
                        )
                    }
                </Container>
                <Container className={"flex float-start mb-3"}>
                        <Row>
                            <Col className={"me-3"}>
                                <FormInputHelper label={"Saldo"}
                                                 name={"balance"}
                                                 value={researchFinance.balance}
                                                 inline
                                                 editing={isEditing}
                                                 onChange={updateResearchFinance}
                                />
                                <FormInputHelper label={"Valor por paciente"}
                                                 name={"valuePerParticipant"}
                                                 value={researchFinance.valuePerParticipant}
                                                 inline
                                                 editing={isEditing}
                                                 onChange={updateResearchFinance}
                                />
                            </Col>
                            <Col className={"ms-3"}>
                                <FormInputHelper label={"Encargo por paciente"}
                                                 name={"roleValuePerParticipant"}
                                                 value={researchFinance.roleValuePerParticipant}
                                                 inline
                                                 editing={isEditing}
                                                 onChange={updateResearchFinance}
                                />

                                <FormInputHelper label={"Nº de pacientes"} value={numOfPatients} inline/>
                            </Col>
                        </Row>
                <Divider/>
                </Container>
            </form>
            <Tabs
                style={{width:"100%"}}
                id="controlled-finance-tab"
                activeKey={selectedFinanceTab}
                onSelect={selectTab}
                className="mb-3 mt-3 justify-content-evenly">

                <TabPane title={"Ensaio"} eventKey={"research-finance"}>
                    <ResearchFinanceEntriesTab
                        canShowForm={!isEditing}
                        entries={researchFinance.monetaryFlow || []}
                        onNewEntry={updateGeneralFinance}
                    />
                </TabPane>

                <TabPane title={"Equipa"} eventKey={"team-finance"}>
                    <ResearchTeamFinanceEntriesTab
                        canShowForm={!isEditing}
                        entries={researchFinance.teamFinanceFlow || []}
                        onNewEntry={updateTeamFinance}
                        team={props.researchTeam}
                    />
                </TabPane>
            </Tabs>
        </Container>
    </React.Fragment>
}
