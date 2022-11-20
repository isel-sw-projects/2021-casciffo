import React, {useEffect, useState} from "react";
import './ProposalForm.css'
import {
    Row
} from "react-bootstrap";
import {InvestigatorTeamColumn} from "./InvestigationTeamColumn";
import {Investigator, Promoter, ProposalForm} from "../../common/Types";
import {PartnershipsColumn} from "./ParternershipsColumn";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {ProposalFormColumn} from "./ProposalFormColumn";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {PartnershipModel} from "../../model/proposal/finance/PartnershipModel";
import {useNavigate} from "react-router-dom";
import {ResearchTypes, TeamRoleTypes} from "../../common/Constants";
import {MyUtil} from "../../common/MyUtil";
import {useErrorHandler} from "react-error-boundary";


type CP_Props = {
    service: ProposalAggregateService
}

type EventValue = string | Promoter | Array<Investigator | PartnershipModel> | File | Investigator
type ProposalFormKey = keyof ProposalForm



export function CreateProposal(props : CP_Props) {
    useEffect(() => {
        document.title = MyUtil.CREATE_PROPOSAL_TITLE
    })
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
        if(proposalForm.researchType === ResearchTypes.CLINICAL_TRIAL.id) {
            model.financialComponent = {
                financialContract: undefined,
                partnerships: proposalForm.partnerships,
                hasPartnerships: hasPartnerships,
                promoter: proposalForm.promoter,
            }
        }

        return model;
    }
    const navigate = useNavigate()
    const errorHandler = useErrorHandler()

    function handleFormSubmit() {
        props.service.saveProposal(proposalFormToModel(proposalForm))
            .then(p => {
                if(p.type === ResearchTypes.CLINICAL_TRIAL.id) {
                    return props.service
                        .saveFinancialContract(p.id + "", p.financialComponent!.id!, proposalForm.file!)
                        .then(() => p)
                }
                return p
            })
            .then((p) => {
                navigate(`/propostas/${p.id}`)
            })
            .catch(errorHandler)
    }

    return (
        <div className={"d-flex justify-content-evenly m-3"}>
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
                    service={props.service}
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
