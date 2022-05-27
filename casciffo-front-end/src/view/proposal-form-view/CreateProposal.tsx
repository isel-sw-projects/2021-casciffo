import React, {useState} from "react";
import './ProposalForm.css'
import {
    Button,
    Row
} from "react-bootstrap";
import {InvestigatorTeamColumn} from "./InvestigationTeamColumn";
import {Investigator, Promoter, ProposalForm} from "../../common/Types";
import {PartnershipsColumn} from "./ParternershipsColumn";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {ProposalFormColumn} from "./ProposalFormColumn";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {PartnershipModel} from "../../model/PartnershipModel";
import {useNavigate} from "react-router-dom";
import {ResearchTypes, TeamRoleTypes} from "../../common/Constants";


type CP_Props = {
    service: ProposalAggregateService
}

type EventValue = string | Promoter | Array<Investigator | PartnershipModel> | File | Investigator
type ProposalFormKey = keyof ProposalForm



export function CreateProposal(props : CP_Props) {

    const [hasPartnerships, setHasPartnerships] = useState(false)

    const [proposalForm, setProposalForm] = useState<ProposalForm>({
        pInvestigator: {id: "", name: "", email: "", teamRole: TeamRoleTypes.PRINCIPAL},
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
            principalInvestigatorId: parseInt(proposalForm.pInvestigator.id),
            serviceTypeId: proposalForm.serviceTypeId,
            sigla: proposalForm.sigla,
            therapeuticAreaId: proposalForm.therapeuticAreaId,
            type: proposalForm.researchType,
            investigationTeam: proposalForm.team.map(i => ({
                memberRole: i.teamRole,
                memberId: parseInt(i.id),
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
    const navigate = useNavigate()

    function handleFormSubmit() {
        console.log(proposalForm);
        console.log("data should have printed");
        props.service.saveProposal(proposalFormToModel(proposalForm))
            .then((p) => {
                navigate(`/propostas/${p.id}`)
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
