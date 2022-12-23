import React, {useState} from "react";
import {Badge, Button, Card, CloseButton, Col, Container, Form} from "react-bootstrap";
import {PartnershipModel} from "../../model/proposal/finance/PartnershipModel";
import {Divider, Tooltip} from "@mui/material";
import {AiFillEdit} from "react-icons/ai";
import {CiFloppyDisk} from "react-icons/ci";
import {ImFloppyDisk} from "react-icons/im";
import {TbDeviceFloppy} from "react-icons/tb";


type PsC_Props = {
    partnerships: Array<PartnershipModel>,
    setPartnerships: (arr: Array<PartnershipModel>) => void
    display: boolean
}

type PartnershipsState = {
    isNewPartnership: boolean,
    partnershipToAdd: PartnershipModel
}

function PartnershipCard(
    props: {
        p: PartnershipModel,
        removePartnership: (partnership: PartnershipModel) => void,
        handlePartnershipOnSaveEdit: (p: PartnershipModel) => void
    }
) {
    const [edit, setEdit] = useState(false)
    const [partnership, setPartnership] = useState(props.p)

    const handleChange = (e: any) => {
        const key = e.target.name
        const value = e.target.vale
        setPartnership(prevState => ({...prevState, [key]: value}))
    }

    const saveChanges = () => {
        setEdit(false)
        props.handlePartnershipOnSaveEdit(partnership)
    }
    const cancelChanges = () => {
        setEdit(false)
        setPartnership(props.p)
    }

    return <Form>
            <br/>
            <br/>
            <Card className={"small"}>
                <Card.Header className="d-flex justify-content-between align-items-start">
                    {
                        edit
                        ?
                        <div>
                            <Tooltip title={"Guardar"}>
                                <Badge bg={"outline-danger"} pill>
                                    <Button variant={"outline-primary"} onClick={saveChanges}>
                                        <CiFloppyDisk size={"2x"}/>
                                        <TbDeviceFloppy size={2}/>
                                    </Button>
                                </Badge>
                            </Tooltip>
                            <Tooltip title={"Cancelar"}>
                                <Badge bg={"outline-danger"} pill>
                                    <Button variant={"outline-primary"} onClick={cancelChanges}>
                                        <AiFillEdit/>
                                    </Button>
                                </Badge>
                            </Tooltip>
                        </div>
                        :
                        <div>
                            <Badge bg={"outline-danger"} pill>
                                <Button variant={"outline-primary"} onClick={() => setEdit(true)}>
                                    <AiFillEdit/>
                                </Button>
                            </Badge>

                            <Badge bg={"outline-danger"} pill>
                                <CloseButton
                                style={{fontSize: 12}}
                                onClick={() => props.removePartnership(partnership)}
                                />
                            </Badge>
                        </div>
                    }
                </Card.Header>
                <Card.Body>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label>Representativo</Form.Label>
                        <Form.Control
                            readOnly={!edit}
                            type={"input"}
                            name={"representative"}
                            value={partnership.representative}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            readOnly={!edit}
                            type={"email"}
                            name={"email"}
                            value={partnership.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label>Contacto Telefónico</Form.Label>
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
                        controlId={"formBasicInput"}
                        hidden={partnership.siteUrl?.length === 0}
                    >
                        <Form.Label>Website</Form.Label>
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
                        controlId={"formBasicInput"}
                        hidden={partnership.description?.length === 0}
                    >
                        <Form.Label>Descrição</Form.Label>
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
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            required
                            type={"input"}
                            name={"name"}
                            value={partnershipToAdd.name}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label>Representativo</Form.Label>
                        <Form.Control
                            required
                            type={"input"}
                            name={"representative"}
                            value={partnershipToAdd.representative}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicEmail"}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            type={"email"}
                            name={"email"}
                            value={partnershipToAdd.email}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label>Contacto Telefónico</Form.Label>
                        <Form.Control
                            required
                            type={"tel"}
                            name={"phoneContact"}
                            value={partnershipToAdd.phoneContact}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                            type={"text"}
                            name={"siteUrl"}
                            value={partnershipToAdd.siteUrl}
                            onChange={handlePartnershipChange}
                        />
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"formBasicInput"}>
                        <Form.Label>Descrição</Form.Label>
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

export function PartnershipsColumn(props: PsC_Props) {
    const [isNewPartnership, setIsNewPartnership] = useState(false)

    function addNewPartnership(partnershipToAdd: PartnershipModel) {
        props.setPartnerships([...props.partnerships, partnershipToAdd])
    }

    function handlePartnershipSaveChanges(partnership: PartnershipModel) {
        props.setPartnerships(props.partnerships.map(p => p.email === partnership.email ? partnership : p))
    }

    function removePartnership(partnership: PartnershipModel) {
        props.setPartnerships(props.partnerships.filter(p => p !== partnership))
    }

    function toggleIsNewPartnership() {
        setIsNewPartnership(prevState => !prevState)
    }

    return (
        !props.display ?
            <Col className="block-example">
                <Card/>
            </Col>
            :
            <Col className="block-example border border-dark">
                <h5 className={"text-center m-2"}>Parcerias</h5>
                <Divider/>
                <br/>
                <br/>

                {props.partnerships
                    .map(partnership =>
                        <PartnershipCard
                            p={partnership}
                            removePartnership={removePartnership}
                            handlePartnershipOnSaveEdit={handlePartnershipSaveChanges}
                        />)
                }

                {isNewPartnership &&
                    <NewPartnershipForm onSubmit={addNewPartnership}
                                        onClose={toggleIsNewPartnership} />
                }
                <br/>
                <Container className={"align-content-center text-center"}>
                    <Button
                        type={"button"}
                        variant={"outline-primary"}
                        style={{
                            borderRadius: "8px"
                        }}
                        onClick={() => toggleIsNewPartnership()}
                        hidden={isNewPartnership}
                    >
                        Adicionar Parceria
                    </Button>
                </Container>
            </Col>
    );
}
