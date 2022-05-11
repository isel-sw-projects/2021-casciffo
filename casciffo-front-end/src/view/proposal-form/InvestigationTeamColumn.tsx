import {Badge, Button, Card, CloseButton, Col, Container, Form, InputGroup, ListGroup} from "react-bootstrap";
import React, {useState} from "react";
import {Investigator} from "../../common/Types";
import {TeamRoleTypes} from "../../model/TeamRoleTypes";
import {AsyncAutoCompleteSearch} from "./AsyncAutoCompleteSearch";
import UserModel from "../../model/user/UserModel";

type InvestigatorTeamState = {
    investigator: Investigator,
    team: Array<Investigator>
}

type ITC_Props = {
    setTeam: (team: Array<Investigator>) => void,
    searchInvestigators: (q: string) => Promise<UserModel[]>
}

export function InvestigatorTeamColumn(props: ITC_Props) {
    const [state, setState] = useState<InvestigatorTeamState>(
        {
            investigator: {
                name: "",
                pid: "",
                teamRole: TeamRoleTypes.MEMBER
            },
            team: []
        })

    function addInvestigatorToTeam() {
        let newTeam = [...state.team, state.investigator]
        props.setTeam(newTeam)
        setState(() => {
            return ({
                team: newTeam,
                investigator: {name: "", pid: "", teamRole: TeamRoleTypes.MEMBER}
            })
        })
    }

    function removeInvestigatorFromTeam(investigator: Investigator) {
        console.log(`investigator to remove: ${investigator}`)
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

    return (
        <Col className="block-example border border-dark">
        Equipa de investigação
        <br/>
        <br/>
        <Form.Group>
            <InputGroup>
                <AsyncAutoCompleteSearch
                    requestUsers={(q: string) => {
                        return props.searchInvestigators(q)
                    }}
                    setInvestigator={i =>
                        handleInvestigatorInputChange(
                            {
                                name: i.name,
                                pid: i.id,
                                teamRole: TeamRoleTypes.MEMBER
                            })}
                />
                <Form.Control
                    aria-required
                    aria-describedby={"basic-addon2"}
                    placeholder={"Identificador do Investigador i.e 1235"}
                    type={"text"}
                    // todo add validation with regular expression
                    name={"name"}
                    value={state.investigator.name}
                    onChange={(e: any) => handleInvestigatorInputChange(e)}
                />
                <Button
                    variant="outline-secondary"
                    id="button-addon2"
                    onClick={(() => addInvestigatorToTeam())}
                >
                    🕀
                </Button>
            </InputGroup>
        </Form.Group>
        <br/>
        <Container>
            <Card>
                <Card.Header style={{backgroundColor: 'lightgray'}}>Equipa</Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {state.team.map((currInvestigator, idx) =>
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
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
    </Col>);
}