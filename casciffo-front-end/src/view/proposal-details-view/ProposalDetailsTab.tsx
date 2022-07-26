import {ProposalModel} from "../../model/proposal/ProposalModel";
import {Button, Col, Container, Form, ListGroup, Row, Stack} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {ResearchTypes} from "../../common/Constants";
import {useNavigate} from "react-router-dom";
import {MyError} from "../error-view/MyError";

type PDT_Props = { dataReady: boolean, proposal: ProposalModel }

export function ProposalDetailsTab(props: PDT_Props) {

    const [isDataReady, setIsDataReady] = useState(false)
    const [proposal, setProposal] = useState<ProposalModel>()

    useEffect(() => {
        setIsDataReady(props.dataReady)
    }, [props.dataReady])

    useEffect(() => {
        setProposal(props.proposal)
    }, [props.proposal])

    const navigate = useNavigate()

    const navigateToResearch = () => {
        if(proposal!.researchId == null)
            throw new MyError("Research Id cannot be null here!", 400)
        navigate(`/research/${proposal!.researchId}`)
    }

    return <React.Fragment>
        <Container className={"border border-top-0"}>
            {isDataReady && proposal ?
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
                                            value={proposal.sigla}
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
                                            value={proposal.serviceType?.name}
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
                                            value={proposal.principalInvestigator?.name}
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
                                            value={proposal.therapeuticArea?.name}
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
                                            value={proposal.pathology?.name}
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    {proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                                        <Form.Group>
                                            <Form.Label>Promotor</Form.Label>
                                            <Form.Control
                                                type={"text"}
                                                name={"promoterName"}
                                                value={proposal.financialComponent?.promoter!.name}
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
                            {proposal.investigationTeam!.map((team, idx) => (
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
        </Container>
        {proposal && proposal.researchId
            && <Button className={"mt-5 mt-md-5"} onClick={navigateToResearch}
                       variant={"outline-success"} style={{borderRadius: "8px", width:"100%"}}>
                {proposal.type === ResearchTypes.CLINICAL_TRIAL.id
                    ? "Ir para ensaio clínico"
                    : "Ir para ensaio observacional"
                }
            </Button>
        }
    </React.Fragment>
}