import React, {useState} from "react";
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
import {Constants, Investigator, Partnership} from "../../common/Types";
import {PartnershipsColumn} from "./ParternershipsColumn";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {TeamRoleTypes} from "../../model/TeamRoleTypes";


type Promoter = {
    promoterName: string,
    promoterEmail: string,
    promoterType: string
}

type ProposalForm = {
    sigla: string,
    serviceId: number,
    therapeuticAreaId: number,
    pathologyId: number,
    pInvestigator: Investigator,
    researchType: string,
    promoter: Promoter,
    team: Array<Investigator>,
    partnerships: Array<Partnership>
}

type CP_Props = {
    service: ProposalAggregateService
}

export function CreateProposal(props : CP_Props) {
    const [constants, setConstants] = useState<Constants>({
        serviceTypes: [],
        pathologies: [],
        therapeuticAreas: []
    })

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
    })
    props.service.fetchConstantsMock().then(setConstants)

    const updateState = (key: keyof ProposalForm, value: string | Promoter | Array<Investigator | Partnership> ) => (
        prevState: ProposalForm
    ): ProposalForm =>
    {
        return ({
            ...prevState,
            [key]: value
        })
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        event.persist()
        console.log(`Input Change!!!!\nProp name: ${event.target.name} \t value:${event.target.value}`)
        let propKey = event.target.name as keyof ProposalForm
        let value = event.target.value
        setProposalForm(updateState(propKey, value))
    }

    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        const form = event.currentTarget;
        //if a proposal is marked with having partnerships, it must have a least 1 partnership
        const isPartnershipsValid = (hasPartnerships && proposalForm.partnerships.length !== 0)
        if (!form.checkValidity() || !isPartnershipsValid) {
            event.preventDefault();
            event.stopPropagation();
        }
        //add the principal investigator to the team
        proposalForm.team.push(proposalForm.pInvestigator)
        console.log(proposalForm);
        console.log("data should have printed");
        //call props.service.saveProposal()
    }

    function handlePromoterChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        const key = event.target.name as keyof Promoter
        const p = {
            ...proposalForm.promoter,
            [key]: value
        }
        setProposalForm(updateState("promoter", p))
    }

    function proposalFormColumn() {

        return (
            <Col className="block-example border border-dark">
                <Form onSubmit={handleFormSubmit}>
                    <Container>
                        <h5>Proposta</h5>
                        <Form.Group className={"mb-3"} controlId={"formBasicSwitch"}>
                            <Stack direction={"horizontal"} gap={3}>
                                <Form.Label>Parcerias</Form.Label>
                                <Form.Check
                                    required
                                    type={"switch"}
                                    name={"hasPartnerships"}
                                    checked={hasPartnerships}
                                    onChange={(() => setHasPartnerships(!hasPartnerships))}
                                />
                            </Stack>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicInput">
                            <Form.Label>Sigla</Form.Label>
                            <Form.Control
                                required
                                type={"text"}
                                name={"sigla"}
                                value={proposalForm.sigla}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicInput">
                            <Form.Label>Identificador do Investigador</Form.Label>
                            <Form.Control
                                required
                                type={"number"}
                                // todo add validation with regular expression
                                name={"pInvestigatorId"}
                                value={proposalForm.pInvestigator.pid}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        {/*TODO MAP DROPDOWN ITEMS FROM DB*/}
                        <Form.Group>
                            <Form.Label>Patologia</Form.Label>
                            <Form.Select
                                required
                                aria-label="Default select example"
                                name={"pathologyId"}
                                defaultValue={-1}
                                onChange={handleInputChange}
                            >
                                <option value={-1} disabled>Patologias</option>
                                {constants.pathologies.map(p =>
                                    <option value={p.id}>{p.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>Tipo de serviço</Form.Label>
                            <Form.Select
                                required
                                aria-label="Default select example"
                                name={"serviceTypeId"}
                                defaultValue={-1}
                                onChange={handleInputChange}
                            >
                                <option value={-1} disabled>Serviço</option>
                                {constants.serviceTypes.map(s =>
                                    <option value={s.id}>{s.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>Área terapeutica</Form.Label>
                            <Form.Select
                                required
                                aria-label="Default select example"
                                name={"therapeuticAreaId"}
                                defaultValue={-1}
                                onChange={handleInputChange}
                            >
                                <option value={-1} disabled>Área terapeuta</option>
                                {constants.therapeuticAreas.map(t =>
                                    <option value={t.id}>{t.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            {Object.values(ResearchTypes).map((rt, idx) => (
                                <div key={`default-radio-${idx}`} className="mb-3">
                                    <Form.Check
                                        aria-required
                                        name={"researchType"}
                                        type={"radio"}
                                        id={`default-radio-${idx}`}
                                        value={rt.id}
                                        label={rt.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            ))}
                        </Form.Group>

                        {proposalForm.researchType === ResearchTypes["CLINICAL_TRIAL"].id
                            ?
                            <Row id={"financial-component"}>
                                <Form.Group>
                                    <Form.Label>Promotor</Form.Label>
                                    <Form.Control
                                        required={proposalForm.researchType === ResearchTypes["CLINICAL_TRIAL"].id}
                                        type={"text"}
                                        name={"promoterName"}
                                        value={proposalForm.promoter.promoterName}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <br/>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required={proposalForm.researchType === ResearchTypes["CLINICAL_TRIAL"].id}
                                        type={"text"}
                                        name={"promoterEmail"}
                                        value={proposalForm.promoter.promoterEmail}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <br/>
                                <Form.Group>
                                    {Object.values(PromoterTypes).map((p, idx) => (
                                        <div key={`default-radio-${idx}`} className="mb-3">
                                            <Form.Check
                                                required={proposalForm.researchType === ResearchTypes["CLINICAL_TRIAL"].id}
                                                name={"promoterType"}
                                                type={"radio"}
                                                id={`default-radio-${idx}`}
                                                value={p.id}
                                                label={p.name}
                                                onChange={handlePromoterChange}
                                            />
                                        </div>
                                    ))}
                                </Form.Group>
                                <br/>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Contrato financeiro</Form.Label>
                                    <Form.Control
                                        required={proposalForm.researchType === ResearchTypes["CLINICAL_TRIAL"].id}
                                        type={"file"}
                                        name={"file"}
                                        // TODO file ??? value={}
                                        onInput={(e: any) => handleInputChange(e)}
                                    />
                                </Form.Group>
                            </Row> : <></>
                        }
                        <Button type={"submit"}>
                            Criar proposta
                        </Button>
                    </Container>
                </Form>
            </Col>
        )
    }

    return (
        <div className={"d-flex justify-content-evenly"}>
            <Row>
                {proposalFormColumn()}
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
