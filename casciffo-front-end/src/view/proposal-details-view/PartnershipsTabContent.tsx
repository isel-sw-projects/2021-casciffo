import {PartnershipModel} from "../../model/PartnershipModel";
import {
    Accordion,
    AccordionButton,
    Badge,
    Button,
    Card,
    CloseButton,
    Col, Collapse,
    Container,
    Form,
    Row,
    Stack
} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";


type PTC_Props = {
    partnerships: Array<PartnershipModel>
}

type PartnershipElement = {
    p: PartnershipModel,
    open: boolean
}

export function PartnershipsTabContent(props: PTC_Props) {
    const [partnerships, setPartnerships] = useState<PartnershipElement[]>([])
    const [displayData, setDisplayData] = useState(false)

    useEffect(() => {
        setPartnerships(props.partnerships.map(p => ({p: p, open: false})))
        setDisplayData(true)
    }, [props.partnerships])

    function toggleDescription(partnership: PartnershipElement, show: boolean) {
        const newPartnerships = partnerships.map(p => {
            if(p.p.id === partnership.p.id) p.open = show;
            return p
        })
        setPartnerships(newPartnerships)
    }

    return  (
        <Container className={"justify-content-evenly"}>
            {displayData ? partnerships.map(partnership =>
                <Card key={partnership.p.id} className={"small mt-1"} style={{width: "18rem", height: "auto"}}>
                    {/*fixme make it prettier*/}
                    <Card.Body>
                        <Card.Title>{partnership.p.name}</Card.Title>
                        <Stack direction={"vertical"} gap={1}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><b>Nome</b></td>
                                        <td>{partnership.p.name}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Representante</b></td>
                                        <td>{partnership.p.representative}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Email</b></td>
                                        <td><a href={`mailto:${partnership.p.email}`}>{partnership.p.email}</a></td>
                                    </tr>
                                    <tr>
                                        <td><b>Contacto</b></td>
                                        <td>{partnership.p.phoneContact}</td>
                                    </tr>
                                    {partnership.p.siteUrl?.length !== 0 ?
                                        <tr>
                                            <td><b>Site</b></td>
                                            <td>{partnership.p.siteUrl}</td>
                                        </tr> : <></>
                                    }
                                </tbody>
                            </table>
                            {/*FIXME THIS DAMN CARD KEEPS BREAKING MAKE IT EXPANDABLE*/}

                            {partnership.p.description?.length !== 0 ?
                                <Container className={"mt-2 border-top text-center"} style={{width: "100%"}}>
                                    <Button
                                        className={"text-center"}
                                        variant={"link"}
                                        onClick={() => toggleDescription(partnership, !partnership.open)}
                                    >
                                        Ver descrição
                                    </Button>
                                    <Collapse in={partnership.open} className={"border-bottom"}>
                                        <p>{partnership.p.description}</p>
                                    </Collapse>
                                </Container>
                                : <></>
                            }
                        </Stack>
                    </Card.Body>
                </Card>
            ) : <></>
            }
        </Container>
    )
}