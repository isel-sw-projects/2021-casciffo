import React, {useCallback, useEffect, useState} from "react";
import './ProposalForm.css'
import {
    Button,
    Col,
    Container,
    Form,
    Row, Stack
} from "react-bootstrap";
import {ResearchTypes} from "../../model/ResearchTypes";
import {PromoterTypes} from "../../model/PromoterTypes";
import {InvestigatorTeamColumn} from "./InvestigationTeamColumn";
import {Constants, Investigator, Partnership, Promoter, ProposalForm} from "../../common/Types";
import {PartnershipsColumn} from "./ParternershipsColumn";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {TeamRoleTypes} from "../../model/TeamRoleTypes";
import {ProposalFormColumn} from "./ProposalFormColumn";

type CP_Props = {
    service: ProposalAggregateService
}

type EventValue = string | Promoter | Array<Investigator | Partnership> | File | Investigator
type ProposalFormKey = keyof ProposalForm

export function CreateProposal(props : CP_Props) {

    const [hasPartnerships, setHasPartnerships] = useState(false)

    const [proposalForm, setProposalForm] = useState<ProposalForm>({
        pInvestigator: {pid: "", name: "", teamRole: TeamRoleTypes.PRINCIPAL},
        partnerships: [],
        pathologyId: -1,
        researchType: "",
        serviceId: -1,
        sigla: "",
        team: [],
        therapeuticAreaId: -1,
        promoter: {
            promoterEmail: "",
            promoterName: "",
            promoterType: ""
        },
        file: undefined
    })

    const updateState = (key: ProposalFormKey, value: EventValue ) =>
        (
            prevState: ProposalForm
        ): ProposalForm =>
    {
        return ({
            ...prevState,
            [key]: value
        })
    }

    function handleFormSubmit(formData: ProposalForm) {
            //add the principal investigator to the team
            proposalForm.team.push(proposalForm.pInvestigator)
            console.log(proposalForm);
            console.log("data should have printed");
            alert("Proposta criada")
            //call props.service.saveProposal(proposalForm)
    }

    return (
        <div className={"d-flex justify-content-evenly"}>
            <Row>
                <ProposalFormColumn
                    onSubmit={handleFormSubmit}
                    service={props.service}
                    formData={proposalForm}
                    hasPartnerships={hasPartnerships}
                    setHasPartnerships={setHasPartnerships}
                    setFormData={setProposalForm}
                />
                <InvestigatorTeamColumn setTeam={(team => setProposalForm(updateState("team", team)))}/>
                {hasPartnerships ?
                    <PartnershipsColumn
                        setPartnerships={(partnerships =>
                            setProposalForm(updateState("partnerships", partnerships)))}
                        partnerships={proposalForm.partnerships}
                    /> :
                    <></>
                }
            </Row>
        </div>
    );
}
