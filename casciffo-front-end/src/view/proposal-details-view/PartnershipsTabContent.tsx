import {PartnershipModel} from "../../model/PartnershipModel";
import {
    Accordion,
    AccordionButton,
    Badge,
    Button,
    Card,
    CloseButton,
    Col,
    Container,
    Form,
    Row,
    Stack
} from "react-bootstrap";
import React from "react";


type PTC_Props = {
    partnerships: Array<PartnershipModel>
}

export function PartnershipsTabContent(props: PTC_Props) {

    return  (
        <Container className={"justify-content-evenly"}>
            {props.partnerships.map(partnership =>
                <Card key={partnership.id} className={"small mt-1"} style={{width: "18rem", height: "20rem"}}>
                    {/*fixme make it prettier*/}
                    <Card.Body>
                        <Card.Title>{partnership.name}</Card.Title>
                        <Stack direction={"vertical"} gap={1}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><b>Nome</b></td>
                                        <td>{partnership.name}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Representante</b></td>
                                        <td>{partnership.representative}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Email</b></td>
                                        <td>{partnership.email}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Contacto</b></td>
                                        <td>{partnership.phoneContact}</td>
                                    </tr>
                                    {partnership.siteUrl?.length !== 0 ?
                                        <tr>
                                            <td><b>Site</b></td>
                                            <td>{partnership.siteUrl}</td>
                                        </tr> : <></>
                                    }
                                </tbody>
                            </table>
                            {/*FIXME THIS DAMN CARD KEEPS BREAKING MAKE IT EXPANDABLE*/}
                            <Container style={{display:"flex", flexDirection:"column"}}>
                                {partnership.description?.length === 0 || true ?
                                    <div style={{overflow:"auto", width: "100%", height:"8rem", flex:1}}>
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                    </div>
                                    :<></>
                                }
                            </Container>
                        </Stack>
                    </Card.Body>
                </Card>
            )}
        </Container>
    )
}