import React, {useState} from "react";
import {Badge, Button, Card, CloseButton, Col, Container, Form} from "react-bootstrap";
import {Partnership} from "../../common/Types";

type PsC_Props = {
    partnerships: Array<Partnership>,
    setPartnerships: (arr: Array<Partnership>) => void
}

type PartnershipsState = {
    isNewPartnership: boolean,
    partnershipToAdd: Partnership
}

export function PartnershipsColumn(props: PsC_Props) {
    const [state, setState] = useState<PartnershipsState>({
        isNewPartnership: false,
        partnershipToAdd: {
            partnershipDescription: "",
            partnershipContact: "",
            partnershipEmail: "",
            partnershipName: "",
            partnershipRepresentative: "",
            partnershipWebsite: ""
        }
    })

    function handlePartnershipChange(event: React.ChangeEvent<HTMLInputElement>) {
        let key = event.target.name as keyof Partnership
        let value = event.target.value
        console.log(state.partnershipToAdd)
        setState(prevState => {
            return ({
                ...prevState,
                partnershipToAdd: {
                    ...prevState.partnershipToAdd,
                    [key]: value
                }
            })
        })
    }

    function addNewPartnership() {
        props.setPartnerships([...props.partnerships, state.partnershipToAdd])
        setState(prevState => {
            return ({
                isNewPartnership: !prevState.isNewPartnership,
                partnershipToAdd: {
                    partnershipDescription: "",
                    partnershipContact: "",
                    partnershipEmail: "",
                    partnershipName: "",
                    partnershipRepresentative: "",
                    partnershipWebsite: ""
                }
            })
        })
    }

    function removePartnership(partnership: Partnership) {
        props.setPartnerships(props.partnerships.filter(p => p !== partnership))
    }

    function toggleIsNewPartnership() {
        setState(prevState => {
            return ({
                ...prevState,
                isNewPartnership: !prevState.isNewPartnership
            })
        })
    }

    return (
        <Col className="block-example border border-dark">
            Parcerias
            <br/>
            <br/>

            {props.partnerships.length === 0 ? <></> :
                <Form>
                    {props.partnerships.map(partnership => (<>
                            <br/>
                            <br/>
                            <Card className={"small"}>
                                <Card.Header className="d-flex justify-content-between align-items-start">
                                    <h6>{partnership.partnershipName}</h6>
                                    <Badge bg={"outline-danger"} pill>
                                        <CloseButton
                                            style={{fontSize: 9}}
                                            onClick={() => removePartnership(partnership)}
                                        />
                                    </Badge>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                        <Form.Label>Representativo</Form.Label>
                                        <Form.Control
                                            readOnly
                                            type={"input"}
                                            name={"partnershipRepresentative"}
                                            value={partnership.partnershipRepresentative}
                                            onChange={handlePartnershipChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            readOnly
                                            type={"email"}
                                            name={"partnershipEmail"}
                                            value={partnership.partnershipEmail}
                                            onChange={handlePartnershipChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                        <Form.Label>Contacto Telefónico</Form.Label>
                                        <Form.Control
                                            readOnly
                                            type={"tel"}
                                            name={"partnershipContact"}
                                            value={partnership.partnershipContact}
                                            onChange={handlePartnershipChange}
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className={"mb-3"}
                                        controlId={"formBasicInput"}
                                        hidden={partnership.partnershipWebsite.length === 0}
                                    >
                                        <Form.Label>Website</Form.Label>
                                        <Form.Control
                                            readOnly
                                            type={"text"}
                                            name={"partnershipWebsite"}
                                            value={partnership.partnershipWebsite}
                                            onChange={handlePartnershipChange}
                                        />
                                    </Form.Group>
                                    {/*TODO HIDE IN BUTTON THAT ONCE CLICKED OPENS DESC FIELD?*/}
                                    <Form.Group
                                        className={"mb-3"}
                                        controlId={"formBasicInput"}
                                        hidden={partnership.partnershipDescription.length === 0}
                                    >
                                        <Form.Label>Descrição</Form.Label>
                                        <Form.Control
                                            readOnly
                                            as={"textarea"}
                                            rows={2}
                                            name={"partnershipDescription"}
                                            value={partnership.partnershipDescription}
                                            onChange={handlePartnershipChange}
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </>
                    ))}
                </Form>
            }
            {state.isNewPartnership ?
                <Form onSubmit={addNewPartnership}>
                    <Container>
                        <Card>
                            <Card.Body>
                                <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        required
                                        type={"input"}
                                        name={"partnershipName"}
                                        value={state.partnershipToAdd.partnershipName}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                    <Form.Label>Representativo</Form.Label>
                                    <Form.Control
                                        required
                                        type={"input"}
                                        name={"partnershipRepresentative"}
                                        value={state.partnershipToAdd.partnershipRepresentative}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                <Form.Group className={"mb-3"} controlId={"formBasicEmail"}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type={"email"}
                                        name={"partnershipEmail"}
                                        value={state.partnershipToAdd.partnershipEmail}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                    <Form.Label>Contacto Telefónico</Form.Label>
                                    <Form.Control
                                        required
                                        type={"tel"}
                                        name={"partnershipContact"}
                                        value={state.partnershipToAdd.partnershipContact}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={"partnershipWebsite"}
                                        value={state.partnershipToAdd.partnershipWebsite}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                {/*TODO HIDE IN BUTTON THAT ONCE CLICKED OPENS DESC FIELD?*/}
                                <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        as={"textarea"}
                                        rows={2}
                                        name={"partnershipDescription"}
                                        value={state.partnershipToAdd.partnershipDescription}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <Button type={"submit"}>Adicionar</Button>
                    </Container>
                </Form> : <></>
            }
            <br/>
            <Container className={"align-content-center"}>
                <Button
                    type={"button"}
                    className={"rounded-circle align-content-center"}
                    onClick={() => toggleIsNewPartnership()}
                    hidden={state.isNewPartnership}
                >
                    Adicionar Parceria
                </Button>
            </Container>
        </Col>
    );
}