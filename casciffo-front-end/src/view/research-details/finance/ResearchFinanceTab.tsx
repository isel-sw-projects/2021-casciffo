import React, {useCallback, useEffect, useState} from "react";
import {Button, Container, TabPane, Tabs} from "react-bootstrap";
import {ResearchTeamFinanceTab} from "./ResearchTeamFinanceTab";
import {ResearchGeneralFinanceTab} from "./ResearchGeneralFinanceTab";
import {ResearchAggregateService} from "../../../services/ResearchAggregateService";
import {ResearchFinance} from "../../../model/research/ResearchModel";
import {FormInputHelper} from "../../components/FormInputHelper";
import {useUserAuthContext} from "../../context/UserAuthContext";
import {Roles} from "../../../model/role/Roles";
import {useErrorHandler} from "react-error-boundary";
import {useParams} from "react-router-dom";

type ResearchFinanceProps = {
    researchService: ResearchAggregateService
    onUpdateResearch: (rf: ResearchFinance) => void
    researchFinance: ResearchFinance
    numOfPatients: number
}

export function ResearchFinanceTab(props: ResearchFinanceProps) {
    const {researchId} = useParams()

    const [selectedFinanceTab, setSelectedFinanceTab] = useState("")
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
        console.log(props.researchFinance)
    }, [props.researchFinance])

    const userToken = useUserAuthContext()

    const canShowEdit = userToken.userToken?.roles?.some(r => r === Roles.SUPERUSER.id || r === Roles.FINANCE.id)

    const toggleEditing = () => setIsEditing(prevState => !prevState)

    const updateResearchFinance = (e: any) => {
        const key = e.target.name as keyof ResearchFinance
        const value = e.target.value
        setResearchFinance(prevState => ({...prevState, [key]: value}))
    }
    
    const errorHandler = useErrorHandler()
    
    const saveResearchFinance = useCallback((rf: ResearchFinance) => {
        setIsEditing(false)
        props.researchService
            .saveResearchFinance(researchId!, rf)
            .then(value => {
                setResearchFinance(value)
                setPrevResearchFinance(value)
            })
            .catch(errorHandler)
    }, [errorHandler, props.researchService, researchId])
    
    const cancelChanges = () => {
        setIsEditing(false)
        setResearchFinance(prevResearchFinance)
    }

    return <React.Fragment>
        <Container className={"border-top border-2 border-secondary"}>

            <Container>
                { canShowEdit && (
                    isEditing
                        ? <>
                            <Button variant={"outline-primary"} onClick={() => saveResearchFinance(researchFinance)}>Guardar Alterações</Button>
                            <Button variant={"outline-danger"} onClick={cancelChanges}>Cancelar</Button>
                        </>
                        : <Button variant={"outline-primary"} onClick={toggleEditing}>Editar</Button>
                    )
                }
            </Container>
            <Container className={"flex float-start mb-3 "} style={{width:"50%"}}>
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
                <FormInputHelper label={"Encargo por paciente"}
                                 name={"roleValuePerParticipant"}
                                 value={researchFinance.roleValuePerParticipant}
                                 inline
                                 editing={isEditing}
                                 onChange={updateResearchFinance}
                />

                <FormInputHelper label={"Nº de pacientes"} value={numOfPatients} inline/>
            </Container>

            <Tabs
                style={{width:"100%"}}
                id="controlled-finance-tab"
                activeKey={selectedFinanceTab}
                onSelect={selectTab}
                className="mb-3 mt-3 justify-content-evenly">

                <TabPane title={"Ensaio"} eventKey={"research-finance"}>
                    <ResearchGeneralFinanceTab
                        entries={researchFinance.researchFinanceEntries || []}/>
                </TabPane>

                <TabPane title={"Equipa"} eventKey={"team-finance"}>
                    <ResearchTeamFinanceTab
                        entries={researchFinance.teamFinance || []}/>
                </TabPane>
            </Tabs>
        </Container>
    </React.Fragment>
}
