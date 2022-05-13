import React, {useCallback, useEffect, useState} from "react";
import './ProposalForm.css'
import {
    Row
} from "react-bootstrap";
import {ResearchTypes} from "../../model/ResearchTypes";
import {InvestigatorTeamColumn} from "./InvestigationTeamColumn";
import {Constants, Investigator, Promoter, ProposalForm} from "../../common/Types";
import {PartnershipsColumn} from "./ParternershipsColumn";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {TeamRoleTypes} from "../../model/TeamRoleTypes";
import {ProposalFormColumn} from "./ProposalFormColumn";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {PartnershipModel} from "../../model/PartnershipModel";
import UserModel from "../../model/user/UserModel";
import {TeamInvestigatorModel} from "../../model/TeamInvestigatorModel";
import {useLocation, useNavigate} from "react-router-dom";
import ApiUrls from "../../common/Links";

type CP_Props = {
    service: ProposalAggregateService
}

type EventValue = string | Promoter | Array<Investigator | PartnershipModel> | File | Investigator
type ProposalFormKey = keyof ProposalForm



export function CreateProposal(props : CP_Props) {

    const [hasPartnerships, setHasPartnerships] = useState(false)
    const [listOfInvestigators, setListOfInvestigators] = useState<Array<UserModel>>([])

    const [proposalForm, setProposalForm] = useState<ProposalForm>({
        pInvestigator: {pid: "", name: "", teamRole: TeamRoleTypes.PRINCIPAL},
        partnerships: [],
        pathologyId: -1,
        researchType: "",
        serviceTypeId: -1,
        sigla: "",
        team: [],
        therapeuticAreaId: -1,
        promoter: {
            email: "",
            name: "",
            promoterType: ""
        },
        file: undefined
    })
    const nagivate = useNavigate()

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

    function proposalFormToModel(proposalForm: ProposalForm) {
        proposalForm.team.push(proposalForm.pInvestigator)
        const model : ProposalModel = {
            pathologyId: proposalForm.pathologyId,
            principalInvestigatorId: parseInt(proposalForm.pInvestigator.pid),
            serviceTypeId: proposalForm.serviceTypeId,
            sigla: proposalForm.sigla,
            therapeuticAreaId: proposalForm.therapeuticAreaId,
            type: proposalForm.researchType,
            investigationTeam: proposalForm.team.map(i => ({
                memberRole: i.teamRole,
                memberId: parseInt(i.pid),
            }))
        }
        console.log(proposalForm.team)
        console.log(model.investigationTeam)
        if(proposalForm.researchType === ResearchTypes.CLINICAL_TRIAL.id) {
            model.financialComponent = {
                file: undefined,
                id: 0,
                partnerships: proposalForm.partnerships,
                promoter: proposalForm.promoter,
            }
        }

        return model;
    }

    function handleFormSubmit() {
        console.log(proposalForm);
        console.log("data should have printed");
        props.service.saveProposal(proposalFormToModel(proposalForm))
            .then((p) => {
                nagivate(`${p.id}`)
            })
    }

    return (
        //TODO ADD FLOATING LABEL TO LOOK COOL
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
                <InvestigatorTeamColumn
                    setTeam={(team => setProposalForm(updateState("team", team)))}
                    searchInvestigators={props.service.fetchInvestigators}
                />
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
