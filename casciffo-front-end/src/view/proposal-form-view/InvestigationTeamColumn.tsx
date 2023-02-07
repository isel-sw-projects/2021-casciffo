import {
    Alert,
    Badge,
    Button,
    Card,
    CloseButton,
    Col,
    Container,
    Form,
    InputGroup,
    ListGroup,
    Stack
} from "react-bootstrap";
import React, {useState} from "react";
import {Investigator} from "../../common/Types";
import {AsyncAutoCompleteSearch} from "./AsyncAutoCompleteSearch";
import {BsPlusSquare} from "react-icons/bs";
import {LONG_TIMEOUT_MILLIS, TeamRoleTypes} from "../../common/Constants";
import ProposalAggregateService from "../../services/ProposalAggregateService";

import {Divider, Tooltip} from "@mui/material";
import {AiOutlineUserAdd} from "react-icons/ai";


type InvestigatorTeamState = {
    investigator: Investigator,
    team: Array<Investigator>
}

type ITC_Props = {
    setTeam: (team: Array<Investigator>) => void,
    setPrincipalInvestigator: (inv: Investigator) => void
    service: ProposalAggregateService
}

export function InvestigatorTeamColumn(props: ITC_Props) {
    const [errorAlert, setErrorAlert] = useState({show: false, msg: ""})
    const [successAlert, setSuccessAlert] = useState({show: false, msg: ""})
    const [state, setState] = useState<InvestigatorTeamState>(
        {
            investigator: {
                name: "",
                id: "",
                email: "",
                teamRole: TeamRoleTypes.MEMBER
            },
            team: []
        })

    function addInvestigatorToTeam(event: React.MouseEvent<HTMLButtonElement>) {
        if (state.investigator.id.length === 0) {
            showErrorMessage("Por favor escolha um investigador da lista de resultados.", LONG_TIMEOUT_MILLIS)
            return
        }
        if (state.team.some(t => t.id === state.investigator.id)) {
            showErrorMessage("O investigador que tentou adicionar já existe.", LONG_TIMEOUT_MILLIS)
            return;
        }
        let newTeam = [...state.team, state.investigator]
        props.setTeam(newTeam)
        setState(prevState => {
            return ({
                team: newTeam,
                investigator: {...prevState.investigator}
            })
        })
    }

    const principalInvestigator = state.team.find(i => i.teamRole === TeamRoleTypes.PRINCIPAL)
    function setPrincipalInvestigator(investigator: Investigator) {
        const newTeam = state.team.map(inv =>
            investigator.id === inv.id
                ? {...inv, teamRole: TeamRoleTypes.PRINCIPAL}
                : {...inv, teamRole: TeamRoleTypes.MEMBER})
        props.setTeam(newTeam)
        setState(prevState => ({
                    ...prevState,
                    team: newTeam}))
        props.setPrincipalInvestigator(investigator)
        showSuccessMessage(`${investigator.name} foi promovido a investigador principal!`, 1250)
    }

    function removeInvestigatorFromTeam(investigator: Investigator) {

        let newTeam = state.team.filter(member => member !== investigator)
        props.setTeam(newTeam)
        setState(prevState => ({
                ...prevState,
                team: newTeam,
            }))
        showSuccessMessage("Removido!", 1250)
    }

    function handleInvestigatorInputChange(investigator: Investigator) {
        setState(prevState => {
            return ({
                ...prevState,
                investigator: investigator
            })
        })
    }

    function showErrorMessage(msg: string, timeout: number) {
        setErrorAlert({show: true, msg: msg})
        setTimeout(() => {
            setErrorAlert({show: false, msg: ""})
        }, timeout)
    }
    function showSuccessMessage(msg: string, timeout: number) {
        setSuccessAlert({show: true, msg: msg})
        setTimeout(() => {
            if(successAlert.msg === msg && successAlert.show)
                setSuccessAlert({show: false, msg: ""})
        }, timeout)
    }

    return (
        <Col className="block-example border border-dark">
            <Container className={"align-content-center"}>
                <Alert
                    style={{position:"absolute"}}
                    variant={"danger"}
                    show={errorAlert.show}
                    onClose={() => setErrorAlert({show: false, msg: ""})}
                    dismissible
                >
                    {errorAlert.msg}
                </Alert>
                <Alert
                    style={{position:"absolute"}}
                    variant={"success"}
                    show={successAlert.show}
                    onClose={() => setSuccessAlert({show: false, msg: ""})}
                    dismissible
                >
                    {successAlert.msg}
                </Alert>
            </Container>
            <h5 className={"text-center m-2"}>Equipa de investigação</h5>
            <Divider/>
            <br/>
            <br/>
            <Container>
                <Form>
                    {}
                    <Form.Group>
                        <Form.Label className={"font-bold"}>Procurar por investigador</Form.Label>
                        <InputGroup>
                            <AsyncAutoCompleteSearch
                                requestUsers={(q: string) => {
                                    return props.service.fetchInvestigators(q)
                                }}
                                setInvestigator={(user =>
                                    handleInvestigatorInputChange(
                                        {
                                            ...user,
                                            teamRole: TeamRoleTypes.MEMBER
                                        }))}
                            />
                            <Tooltip title={"Adicionar à equipa"}>
                                <Button
                                    id="button-addon2"
                                    className={"btn-plus"}
                                    variant="outline-secondary"
                                    onClick={addInvestigatorToTeam}
                                >
                                    <BsPlusSquare className={"mb-1"}/>
                                </Button>
                            </Tooltip>
                        </InputGroup>
                    </Form.Group>
                </Form>
                <br/>
                <Card>
                    <Card.Header className={"text-center border-bottom border-2 m"} style={{backgroundColor: ''}}>
                        <b>Equipa</b>
                    </Card.Header>
                    <Card.Body>
                        <ListGroup as={"ul"} className={"mt-2"} variant="flush">
                            <label className={"font-bold"}>Investigador Principal</label>
                            <ListGroup.Item
                                as={"li"}
                                className={`d-flex justify-content-between mt-2 border border-2 ${principalInvestigator ? '' :'border-warning'}`}
                                key={`principal-investigador-item`}
                            >
                                {
                                    principalInvestigator ?
                                        <div className={"font-bold flex"}>
                                            <Stack direction={"vertical"} gap={1}>
                                                {principalInvestigator.name}
                                                <small>
                                                    {principalInvestigator.email}
                                                </small>
                                            </Stack>
                                            <div className={"flex float-end"} style={{}}>
                                                <Tooltip title={"Remover da equipa"} style={{position:"absolute"}}>
                                                    <Badge bg={"outline-danger"} pill style={{top:5, right:0, position:"absolute"}}>
                                                        <CloseButton
                                                            style={{fontSize: 12}}
                                                            onClick={() => removeInvestigatorFromTeam(principalInvestigator)}
                                                        />
                                                    </Badge>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        :
                                        <span className={"font-bold"}>
                                            É necessário um investigador principal para submeter a proposta.
                                            <br/>
                                            <small className={"text-info"}>
                                                Podes fazer isto ao clicar no botão <AiOutlineUserAdd/>
                                                <br/>
                                                Presente no lado esquerdo de um investigador.
                                            </small>
                                        </span>
                                }
                            </ListGroup.Item>
                            <br/>  <Divider/>

                            {state.team
                                .filter(i => i.teamRole === TeamRoleTypes.MEMBER)
                                .map((currInvestigator, idx) =>
                                <ListGroup.Item
                                    as="li"
                                    className="flex mt-2"
                                    style={{backgroundColor: (idx & 1) === 1 ? 'white' : 'whitesmoke', padding: 6}}
                                    key={`${currInvestigator}-${idx}`}
                                >
                                    <div className={"flex"}>
                                    <div className={"float-start"}>
                                        <Tooltip title={"Definir como investigador principal"}  >
                                            <Badge bg={"outline-danger"} pill>
                                                <Button variant={"outline-primary"} onClick={() => setPrincipalInvestigator(currInvestigator)}>
                                                    <AiOutlineUserAdd/>
                                                </Button>
                                            </Badge>
                                        </Tooltip>
                                    </div>
                                    <Divider orientation="vertical" flexItem />
                                        <div className={"float-start"}>
                                            {currInvestigator.name}
                                            <br/>
                                            <small>
                                                {currInvestigator.email}
                                            </small>
                                        </div>
                                        <div className={"flex"} style={{padding: 6}}>
                                            <div className={"float-end"}>
                                                <Tooltip title={"Remover da equipa"}>
                                                    <Badge bg={"outline-danger"} pill>
                                                        <CloseButton
                                                            style={{fontSize: 12}}
                                                            onClick={() => removeInvestigatorFromTeam(currInvestigator)}
                                                        />
                                                    </Badge>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Container>
        </Col>
    );
}