import React, {useState} from "react";
import {Badge, Button, Card, CloseButton, Col, Container, Form} from "react-bootstrap";
import {PartnershipModel} from "../../model/PartnershipModel";


type PsC_Props = {
    partnerships: Array<PartnershipModel>,
    setPartnerships: (arr: Array<PartnershipModel>) => void
}

type PartnershipsState = {
    isNewPartnership: boolean,
    partnershipToAdd: PartnershipModel
}

export function PartnershipsColumn(props: PsC_Props) {
    const [state, setState] = useState<PartnershipsState>({
        isNewPartnership: false,
        partnershipToAdd: {
            description: "",
            phoneContact: "",
            email: "",
            name: "",
            representative: "",
            siteUrl: ""
        }
    })

    function handlePartnershipChange(event: React.ChangeEvent<HTMLInputElement>) {
        let key = event.target.name as keyof PartnershipModel
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
                    description: "",
                    phoneContact: "",
                    email: "",
                    name: "",
                    representative: "",
                    siteUrl: ""
                }
            })
        })
    }

    function removePartnership(partnership: PartnershipModel) {
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
                                    <h6>{partnership.name}</h6>
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
                                            name={"representative"}
                                            value={partnership.representative}
                                            onChange={handlePartnershipChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            readOnly
                                            type={"email"}
                                            name={"email"}
                                            value={partnership.email}
                                            onChange={handlePartnershipChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                        <Form.Label>Contacto Telefónico</Form.Label>
                                        <Form.Control
                                            readOnly
                                            type={"tel"}
                                            name={"phoneContact"}
                                            value={partnership.phoneContact}
                                            onChange={handlePartnershipChange}
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className={"mb-3"}
                                        controlId={"formBasicInput"}
                                        hidden={partnership.siteUrl?.length === 0}
                                    >
                                        <Form.Label>Website</Form.Label>
                                        <Form.Control
                                            readOnly
                                            type={"text"}
                                            name={"siteUrl"}
                                            value={partnership.siteUrl}
                                            onChange={handlePartnershipChange}
                                        />
                                    </Form.Group>
                                    {/*TODO HIDE IN BUTTON THAT ONCE CLICKED OPENS DESC FIELD?*/}
                                    <Form.Group
                                        className={"mb-3"}
                                        controlId={"formBasicInput"}
                                        hidden={partnership.description?.length === 0}
                                    >
                                        <Form.Label>Descrição</Form.Label>
                                        <Form.Control
                                            readOnly
                                            as={"textarea"}
                                            rows={2}
                                            name={"description"}
                                            value={partnership.description}
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
                                        name={"name"}
                                        value={state.partnershipToAdd.name}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                    <Form.Label>Representativo</Form.Label>
                                    <Form.Control
                                        required
                                        type={"input"}
                                        name={"representative"}
                                        value={state.partnershipToAdd.representative}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                <Form.Group className={"mb-3"} controlId={"formBasicEmail"}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type={"email"}
                                        name={"email"}
                                        value={state.partnershipToAdd.email}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                    <Form.Label>Contacto Telefónico</Form.Label>
                                    <Form.Control
                                        required
                                        type={"tel"}
                                        name={"phoneContact"}
                                        value={state.partnershipToAdd.phoneContact}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={"siteUrl"}
                                        value={state.partnershipToAdd.siteUrl}
                                        onChange={handlePartnershipChange}
                                    />
                                </Form.Group>
                                {/*TODO HIDE IN BUTTON THAT ONCE CLICKED OPENS DESC FIELD?*/}
                                <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        as={"textarea"}
                                        rows={2}
                                        name={"description"}
                                        value={state.partnershipToAdd.description}
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