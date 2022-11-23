import {TeamInvestigatorModel} from "../../../model/user/TeamInvestigatorModel";
import {VisitInvestigator} from "../../../model/research/ResearchModel";
import {CloseButton, Dropdown, ListGroup} from "react-bootstrap";
import React from "react";
import UserModel from "../../../model/user/UserModel";

type Props = {
    visitInvestigators: VisitInvestigator[],
    addInvestigatorToVisit: (member: UserModel) => void,
    removeInvestigatorFromVisit: (memberId: string) => void,
    possibleInvestigators?: TeamInvestigatorModel[]
}

export function FormListVisitInvestigators(props: Props ) {

    const filterInvestigatorsNotChosen = (investigator: TeamInvestigatorModel) => {
        return props.visitInvestigators!.every(vi => vi.investigatorId !== investigator.memberId)
    }

    return <div>
        <Dropdown style={{width: "100%"}}>
            <Dropdown.Toggle className={"mb-2"} split variant={"outline-primary"}
                             style={{width: "100%"}}>
                {"Adicionar Investigador "}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{width: "100%"}}>
                {props.possibleInvestigators?.length !== props.visitInvestigators!.length ?
                    props.possibleInvestigators
                        ?.filter(filterInvestigatorsNotChosen)
                        ?.map((t, i) =>
                            <Dropdown.Item key={i} onClick={() => props.addInvestigatorToVisit(t.member!)}>
                                {t.member!.name}
                                <br/>
                                <small>
                                    {t.member!.email}
                                </small>
                            </Dropdown.Item>)
                    : <Dropdown.Item key={"empty menu"}>
                        <span className={"text-warning"}>Não existem mais investigadores!</span>
                    </Dropdown.Item>
                }
            </Dropdown.Menu>
        </Dropdown>

        <ListGroup>
            <ListGroup.Item className={"border-bottom border-secondary text-center"}>Investigadores
                associados à visita <span style={{color: "red"}}>*</span></ListGroup.Item>

            {props.visitInvestigators
                .map((inv, idx) =>
                    <ListGroup.Item key={inv.investigatorId} className={"flex-column"}
                                    variant={(idx & 1) === 1 ? "dark" : "light"}>
                        <table style={{width: "100%"}}>
                            <colgroup>
                                <col span={1} style={{width: "90%"}}/>
                                <col span={1} style={{width: "10%"}}/>
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td><div>
                                        {inv.investigator!.name}
                                        <br/>
                                        <small>
                                            {inv.investigator!.email}
                                        </small>
                                    </div></td>
                                    <td><CloseButton onClick={() => props.removeInvestigatorFromVisit(inv.investigatorId!)}/></td>
                                </tr>
                            </tbody>
                        </table>
                    </ListGroup.Item>)}
        </ListGroup>
    </div>
}