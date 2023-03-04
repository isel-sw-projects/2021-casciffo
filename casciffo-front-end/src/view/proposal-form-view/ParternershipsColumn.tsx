import React, {useEffect, useState} from "react";
import {Badge, Button, Card, CloseButton, Col, Container, Form} from "react-bootstrap";
import {PartnershipModel} from "../../model/proposal/finance/PartnershipModel";
import {Divider, Tooltip} from "@mui/material";
import {AiFillEdit} from "react-icons/ai";
import {FcCancel} from "react-icons/fc";
import {ImFloppyDisk} from "react-icons/im";
import {RequiredLabel} from "../components/RequiredLabel";


type Props = {
    partnerships: Array<PartnershipModel>,
    setPartnerships: (arr: Array<PartnershipModel>) => void
    display: boolean
}

export function PartnershipsColumn(props: Props) {
    const [isNewPartnership, setIsNewPartnership] = useState(false)

    function addNewPartnership(partnershipToAdd: PartnershipModel) {
        props.setPartnerships([...props.partnerships, partnershipToAdd])
        setIsNewPartnership(false)
    }

    function handlePartnershipSaveChanges(partnership: PartnershipModel) {
        props.setPartnerships(props.partnerships.map(p => p.email === partnership.email ? partnership : p))
    }

    function removePartnership(partnership: PartnershipModel) {
        props.setPartnerships(props.partnerships.filter(p => p !== partnership))
    }

    return (
        !props.display ?
            <Col sm={12} md={4}>
                <Card/>
            </Col>
            :
            <Col sm={12} md={4} className="border border-dark">
                <h5 className={"text-center m-2"}>Parcerias</h5>
                <Divider/>
                <br/>
                <br/>

                {props.partnerships
                    .map(partnership =>
                        <PartnershipCard
                            key={`partnership-card-component-${partnership.email}`}
                            p={partnership}
                            removePartnership={removePartnership}
                            handlePartnershipOnSaveEdit={handlePartnershipSaveChanges}
                        />)
                }

                {isNewPartnership &&
                    <NewPartnershipForm onSubmit={addNewPartnership}
                                        onClose={() => setIsNewPartnership(false)} />
                }
                <br/>
                <Container className={"align-content-center text-center"}>
                    <Button
                        type={"button"}
                        variant={"outline-primary"}
                        style={{
                            borderRadius: "8px"
                        }}
                        onClick={() => setIsNewPartnership(true)}
                        hidden={isNewPartnership}
                    >
                        Adicionar Parceria
                    </Button>
                </Container>
            </Col>
    );
}

function PartnershipCard(
    props: {
        p: PartnershipModel,
        removePartnership: (partnership: PartnershipModel) => void,
        handlePartnershipOnSaveEdit: (p: PartnershipModel) => void
    }
) {
    const emptyPartnership = () => ({
        description: "",
        phoneContact: "",
        email: "",
        name: "",
        representative: "",
        siteUrl: "",
    })
    const [edit, setEdit] = useState(false)
    const [partnership, setPartnership] = useState<PartnershipModel>(emptyPartnership())
    const [previous, setPrevious] = useState<PartnershipModel>(emptyPartnership())

    useEffect(() => {
        setPartnership(props.p)
        setPrevious(props.p)
    }, [props.p])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.name
        const value = e.target.value
        setPartnership(prevState => ({...prevState, [key]: value}))
    }

    const saveChanges = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setEdit(false)
        setPrevious(partnership)
        props.handlePartnershipOnSaveEdit(partnership)
    }
    const cancelChanges = () => {
        setEdit(false)
        setPartnership(previous)
    }

    return <Form key={`partnership-form-${partnership.email}`} onSubmit={saveChanges}>
        <br/>
        <br/>
        <Card className={"small"} key={`partnership-card-${partnership.email}`}>
            <Card.Header>
                <div className={"flex"}>

                    {
                        edit
                            ?
                            <div>
                                <div className={"float-start"}>
                                    <Tooltip title={"Guardar"}>
                                        <Badge bg={"outline-danger"} pill>
                                            <Button variant={"outline-primary"} type={"submit"}>
                                                <ImFloppyDisk/>
                                            </Button>
                                        </Badge>
                                    </Tooltip>
                                </div>
                                <div className={"float-end"}>
                                    <Tooltip title={"Cancelar"}>
                                        <Badge bg={"outline-danger"} pill>
                                            <Button variant={"outline-primary"} onClick={cancelChanges}>
                                                <FcCancel/>
                                            </Button>
                                        </Badge>
                                    </Tooltip>
                                </div>
                            </div>
                            :
                            <div>
                                <div className={"float-start"}>
                                    <Tooltip title={"Editar"}>
                                        <Badge bg={"outline-danger"} pill>
                                            <Button variant={"outline-primary"} onClick={() => setEdit(true)}>
                                                <AiFillEdit/>
                                            </Button>
                                        </Badge>
                                    </Tooltip>
                                </div>
                                <div className={"float-end"}>
                                    <Tooltip title={"Remover"}>
                                        <Badge bg={"outline-danger"} pill>
                                            <CloseButton
                                                style={{fontSize: 12}}
                                                onClick={() => props.removePartnership(partnership)}
                                            />
                                        </Badge>
                                    </Tooltip>
                                </div>
                            </div>
                    }
                </div>
            </Card.Header>
            <Card.Body>
                <Form.Group className={"mb-3"} controlId={"name-group"}>
                    <RequiredLabel label={"Nome"}/>
                    <Form.Control
                        required
                        readOnly={!edit}
                        type={"text"}
                        name={"name"}
                        value={partnership.name}
                        onChange={handleChange}
                    />
                </Form.Group><Form.Group className={"mb-3"} controlId={"email-group"}>
                <RequiredLabel label={"Email"}/>
                <Form.Control
                    required
                    readOnly={!edit}
                    type={"email"}
                    name={"email"}
                    value={partnership.email}
                    onChange={handleChange}
                />
            </Form.Group>
                <Form.Group className={"mb-3"} controlId={"rep-group"}>
                    <Form.Label className={"font-bold"}> Representativo </Form.Label>
                    <Form.Control
                        readOnly={!edit}
                        type={"input"}
                        name={"representative"}
                        value={partnership.representative}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"phone-group"}>
                    <Form.Label className={"font-bold"}>Contacto Telefónico</Form.Label>
                    <Form.Control
                        readOnly={!edit}
                        type={"tel"}
                        name={"phoneContact"}
                        value={partnership.phoneContact}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group
                    className={"mb-3"}
                    controlId={"site-group"}
                    hidden={partnership.siteUrl?.length === 0 || !edit}
                >
                    <Form.Label className={"font-bold"}>Website</Form.Label>
                    <Form.Control
                        readOnly={!edit}
                        type={"text"}
                        name={"siteUrl"}
                        value={partnership.siteUrl}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group
                    className={"mb-3"}
                    controlId={"description-group"}
                    hidden={partnership.description?.length === 0 || !edit}
                >
                    <Form.Label className={"font-bold"}>Descrição</Form.Label>
                    <Form.Control
                        readOnly={!edit}
                        as={"textarea"}
                        rows={2}
                        name={"description"}
                        value={partnership.description}
                        onChange={handleChange}
                    />
                </Form.Group>
            </Card.Body>
        </Card>
    </Form>
}

function NewPartnershipForm(
    props: {
        onSubmit: (p: PartnershipModel) => void,
        onClose: () => void
    }
) {
    const emptyPartnership = () => ({
        description: "",
        phoneContact: "",
        email: "",
        name: "",
        representative: "",
        siteUrl: ""
    })
    const [partnershipToAdd, setPartnershipToAdd] = useState<PartnershipModel>(emptyPartnership())

    function handlePartnershipChange(event: React.ChangeEvent<HTMLInputElement>) {
        let key = event.target.name as keyof PartnershipModel
        let value = event.target.value
        setPartnershipToAdd(prevState =>
            ({
                ...prevState,
                [key]: value
            }))
    }

    function onSubmit(e: any) {
        e.preventDefault()
        e.stopPropagation()
        props.onSubmit(partnershipToAdd)
        setPartnershipToAdd(emptyPartnership())
    }

    return <Form onSubmit={onSubmit}>
        <Container>
            <Card>
                <Card.Header>Nova Parceria {<CloseButton className={"float-end"}
                                                         onClick={props.onClose}/>}</Card.Header>
                <Card.Body>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <RequiredLabel label={"Nome"}/>
                        <Form.Control
                            required
                            type={"input"}
                            name={"name"}
                            value={partnershipToAdd.name}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicEmail"}>
                        <RequiredLabel label={"Email"}/>
                        <Form.Control
                            required
                            type={"email"}
                            name={"email"}
                            value={partnershipToAdd.email}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label className={"font-bold"}>Representativo</Form.Label>
                        <Form.Control
                            type={"input"}
                            name={"representative"}
                            value={partnershipToAdd.representative}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label className={"font-bold"}>Contacto Telefónico</Form.Label>
                        <Form.Control
                            type={"tel"}
                            name={"phoneContact"}
                            value={partnershipToAdd.phoneContact}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label className={"font-bold"}>Website</Form.Label>
                        <Form.Control
                            type={"text"}
                            name={"siteUrl"}
                            value={partnershipToAdd.siteUrl}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label className={"font-bold"}>Descrição</Form.Label>
                        <Form.Control
                            as={"textarea"}
                            rows={2}
                            name={"description"}
                            value={partnershipToAdd.description}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                </Card.Body>
            </Card>

            <Button type={"submit"}>Adicionar</Button>
        </Container>
    </Form>;
}
