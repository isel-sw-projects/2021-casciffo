import {ProposalModel} from "../../model/proposal/ProposalModel";
import {ButtonGroup, Col, Container, Form, ListGroup, Row, Stack, Tab} from "react-bootstrap";
import ProposalService from "../../services/ProposalService";
import {StateService} from "../../services/StateService";
import React, {useState} from "react";
import {StateModel} from "../../model/state/StateModel";
import {STATES} from "../../model/state/STATES";
import {ResearchTypes} from "../../common/Constants";

type PDT_Props = { dataReady: boolean, proposal: ProposalModel }

export function ProposalDetailsTab(props: PDT_Props) {
    return <Container className={"border border-top-0"}>
        {props.dataReady ?
            <Stack direction={"horizontal"}>
                <Container>
                    <Form>
                        <Row className={"mb-2 mt-2"}>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Sigla</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={"sigla"}
                                        value={props.proposal.sigla}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Serviço</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={"serviceTypeName"}
                                        value={props.proposal.serviceType?.name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Investigator</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={"investigator"}
                                        value={props.proposal.principalInvestigator?.name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className={"mb-2"}>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Área terapeutica</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={"therapeuticArea"}
                                        value={props.proposal.therapeuticArea?.name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Patologia</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={"pathology"}
                                        value={props.proposal.pathology?.name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                {props.proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                                    <Form.Group>
                                        <Form.Label>Promotor</Form.Label>
                                        <Form.Control
                                            type={"text"}
                                            name={"promoterName"}
                                            value={props.proposal.financialComponent?.promoter!.name}
                                            disabled
                                        />
                                    </Form.Group>
                                    : <></>
                                }
                            </Col>
                        </Row>

                    </Form>
                </Container>
                <Container className={"border-start"}>
                    <label>Equipa</label>
                    <ListGroup className={"mb-2"} style={{overflow: "auto", maxHeight: 400}}>
                        {/*TODO eventually add a way to seperate the columns or add overflow*/}
                        {props.proposal.investigationTeam!.map((team, idx) => (
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                                style={{backgroundColor: (idx & 1) === 1 ? 'white' : 'whitesmoke'}}
                                key={`${team.member?.name}-${idx}`}
                            >
                                <small>
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{team.member?.name}</div>
                                        {team.member?.email}
                                    </div>
                                </small>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Container>
            </Stack>
            : <span>A carregar dados...</span>
        }
    </Container>;
}