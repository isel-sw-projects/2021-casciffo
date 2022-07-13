import {Alert, Badge, Button, Card, CloseButton, Col, Container, Form, InputGroup, ListGroup} from "react-bootstrap";
import React, {useState} from "react";
import {Investigator} from "../../common/Types";
import {AsyncAutoCompleteSearch} from "./AsyncAutoCompleteSearch";
import UserModel from "../../model/user/UserModel";
import {BsPlusSquare} from "react-icons/bs";
import {TeamRoleTypes} from "../../common/Constants";


type InvestigatorTeamState = {
    investigator: Investigator,
    team: Array<Investigator>
}

type ITC_Props = {
    setTeam: (team: Array<Investigator>) => void,
    searchInvestigators: (q: string) => Promise<UserModel[]>
}

export function InvestigatorTeamColumn(props: ITC_Props) {
    const [errorState, setErrorState] = useState({show: false, message: ""})
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
            showErrorMessage("Por favor escolha um investigador da lista de resultados.")
            return
        }
        if (state.team.some(t => t.id === state.investigator.id)) {
            showErrorMessage("O investigador que tentou adicionar já existe.")
            return;
        }
        let newTeam = [...state.team, state.investigator]
        props.setTeam(newTeam)
        setState(() => {
            return ({
                team: newTeam,
                investigator: {name: "", id: "", email: "", teamRole: TeamRoleTypes.MEMBER}
            })
        })
    }

    function removeInvestigatorFromTeam(investigator: Investigator) {
        let newTeam = state.team.filter(member => member !== investigator)
        props.setTeam(newTeam)
        setState(prevState => {
            return ({
                ...prevState,
                team: newTeam,
            })
        })
    }

    function handleInvestigatorInputChange(investigator: Investigator) {
        setState(prevState => {
            return ({
                ...prevState,
                investigator: investigator
            })
        })
    }

    function showErrorMessage(msg: string) {
        setErrorState({show: true, message: msg})
        setTimeout(() => {
            setErrorState({show: false, message: ""})
        }, 8000)
    }

    return (
        <Col className="block-example border border-dark">
            <Alert
                variant={"danger"}
                show={errorState.show}
                onClose={() => setErrorState({show: false, message: ""})}
                dismissible
            >
                {errorState.message}
            </Alert>
            Equipa de investigação
            <br/>
            <br/>
            <Form.Group>
                <InputGroup>
                    <AsyncAutoCompleteSearch
                        requestUsers={(q: string) => {
                            return props.searchInvestigators(q)
                        }}
                        setInvestigator={(user =>
                            handleInvestigatorInputChange(
                                {
                                    ...user,
                                    teamRole: TeamRoleTypes.MEMBER
                                }))}
                    />
                    <Button
                        className={"btn-plus"}
                        variant="outline-secondary"
                        id="button-addon2"
                        onClick={addInvestigatorToTeam}
                    >
                        <BsPlusSquare className={"mb-1"}/>
                    </Button>
                </InputGroup>
            </Form.Group>
            <br/>
            <Container>
                <Card>
                    <Card.Header className={"text-center border-bottom border-2 m"} style={{backgroundColor: ''}}>
                        <b>Equipa</b>
                    </Card.Header>
                    <Card.Body>
                        <ListGroup className={"mt-2"} variant="flush">
                            {state.team.map((currInvestigator, idx) =>
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start mt-2"
                                    style={{backgroundColor: (idx & 1) === 1 ? 'white' : 'whitesmoke'}}
                                    key={`${currInvestigator}-${idx}`}
                                >
                                    {currInvestigator.name}
                                    <Badge bg={"outline-danger"} pill>
                                        <CloseButton
                                            style={{fontSize: 9}}
                                            onClick={() => removeInvestigatorFromTeam(currInvestigator)}
                                        />
                                    </Badge>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Container>
        </Col>
    );
}