import {PartnershipModel} from "../../../model/proposal/finance/PartnershipModel";
import {
    Button,
    Card,
    Collapse,
    Container,
    Stack
} from "react-bootstrap";
import React, {useEffect, useState} from "react";


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
                <Card key={partnership.p.id} className={"small m-3"}
                      style={{width: "21rem", height: "auto", backgroundColor: "#f2f7ff", border: "10px solid", borderColor: "#264f8e"}}>
                    <Card.Body>
                        <Card.Title>{partnership.p.name}</Card.Title>
                        <Stack direction={"vertical"} gap={1}>
                            <table>
                                <colgroup>
                                    <col key={"first"} span={1} style={{width: "40%"}}/>
                                    <col key={"second"} span={1} style={{width: "60%"}}/>
                                </colgroup>
                                <tbody>
                                <tr>
                                    <td><b>Nome</b></td>
                                    <td style={{overflowWrap: "break-word"}}>{partnership.p.name}</td>
                                </tr>
                                <tr>
                                    <td><b>Email</b></td>
                                    <td style={{wordBreak: "break-all"}}><a href={`mailto:${partnership.p.email}`}>{partnership.p.email}</a></td>
                                </tr>
                                {partnership.p.representative && partnership.p.representative.length !== 0 &&
                                    <tr>
                                        <td><b>Representante</b></td>
                                        <td style={{overflowWrap: "break-word"}}>{partnership.p.representative}</td>
                                    </tr>
                                }
                                {partnership.p.phoneContact && partnership.p.phoneContact.length !== 0 &&
                                    <tr>
                                        <td><b>Contacto</b></td>
                                        <td style={{overflowWrap: "break-word"}}>{partnership.p.phoneContact}</td>
                                    </tr>
                                }
                                {partnership.p.siteUrl && partnership.p.siteUrl.length !== 0 ?
                                    <tr>
                                        <td><b>Site</b></td>
                                        <td style={{overflowWrap: "break-word"}}>{partnership.p.siteUrl}</td>
                                    </tr> : <></>
                                }
                                </tbody>
                            </table>

                            {partnership.p.description && partnership.p.description.length !== 0 ?
                                <Container className={"mt-2 border-top text-center border-2"} style={{width: "100%"}}>
                                    <Button
                                        className={"text-center"}
                                        variant={"link"}
                                        onClick={() => toggleDescription(partnership, !partnership.open)}
                                    >
                                        Ver descrição
                                    </Button>
                                    <Collapse in={partnership.open} className={"border-bottom border-2"}>
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