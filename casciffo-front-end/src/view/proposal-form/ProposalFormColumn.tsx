import {Button, Col, Container, Form, Stack} from "react-bootstrap";
import {ResearchTypes} from "../../model/ResearchTypes";
import {PromoterTypes} from "../../model/PromoterTypes";
import React, {useEffect, useState} from "react";
import {Constants, Investigator, Partnership, Promoter, ProposalForm} from "../../common/Types";
import ProposalAggregateService from "../../services/ProposalAggregateService";

type PFC_Props = {
    onSubmit: (formData: ProposalForm) => void,
    service: ProposalAggregateService,
    setHasPartnerships: (state: boolean) => void,
    hasPartnerships: boolean,
    setFormData: (updateState: (prevState: ProposalForm) => ProposalForm) => void,
    formData: ProposalForm
}

type EventValue = string | Promoter | Array<Investigator | Partnership> | File | Investigator
type ReactGeneralInputValue = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
type ProposalFormKey = keyof ProposalForm

export function ProposalFormColumn(props: PFC_Props) {

    const [constants, setConstants] = useState<Constants>({
        serviceTypes: [],
        pathologies: [],
        therapeuticAreas: []
    })

    useEffect(() => {
        props.service.fetchConstants().then(setConstants)
    }, [props.service])
    

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

    function handleInputChange(event: ReactGeneralInputValue) {
        event.persist()
        console.log(`Input Change!!!!\nProp name: ${event.target.name} \t value:${event.target.value}`)
        let propKey = event.target.name as keyof ProposalForm
        let value = event.target.value
        props.setFormData(updateState(propKey, value))
    }

    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        const form = event.currentTarget;
        //if a proposal is marked with having partnerships, it must have a least 1 partnership
        const isPartnershipsValid = props.formData.partnerships.length !== 0 || !props.hasPartnerships
        if (!form.checkValidity() && isPartnershipsValid) {
            event.preventDefault();
            event.stopPropagation();
            return
        }
        props.onSubmit(props.formData)
    }

    function handlePromoterChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        const key = event.target.name as keyof Promoter
        const p = {
            ...props.formData.promoter,
            [key]: value
        }
        props.setFormData(updateState("promoter", p))
    }

    function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
        if(event.target.files === null) {
            event.preventDefault()
            event.stopPropagation()
            return
        }
        let file = event.target.files!.item(0)
        if(file === null) return;
        props.setFormData(updateState("file", file))
    }

    return (
        <Col key={"proposal-form-col"} className="block-example border border-dark">
            <Form onSubmit={handleFormSubmit}>
                <Container>
                    <h5>Proposta</h5>
                    <Form.Group className={"mb-3"} controlId={"formBasicSwitch"}>
                        <Stack direction={"horizontal"} gap={3}>
                            <Form.Label>Parcerias</Form.Label>
                            <Form.Check
                                key={"switch-partnerships"}
                                type={"switch"}
                                name={"hasPartnerships"}
                                checked={props.hasPartnerships}
                                onChange={(() => props.setHasPartnerships(!props.hasPartnerships))}
                            />
                        </Stack>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicInput">
                        <Form.Label>Sigla</Form.Label>
                        <Form.Control
                            key={"sigla"}
                            required
                            type={"text"}
                            name={"sigla"}
                            value={props.formData.sigla}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicInput">
                        <Form.Label>Identificador do Investigador</Form.Label>
                        <Form.Control
                            key={"investigator-name-id"}
                            required
                            type={"text"}
                            // todo add validation with regular expression
                            name={"pInvestigator.name"}
                            value={props.formData.pInvestigator.name}
                            onChange={(event =>
                                props.setFormData(
                                    updateState("pInvestigator",
                                        {...props.formData.pInvestigator, name: event.target.value}
                                    )))}
                        />
                    </Form.Group>
                    <Form.Group key={"patologia-bit"}>
                        <Form.Label>Patologia</Form.Label>
                        <Form.Select
                            key={"pathology-id"}
                            required
                            aria-label="Default select example"
                            name={"pathologyId"}
                            defaultValue={-1}
                            onChange={handleInputChange}
                        >
                            <option key={"op-invalid"} value={-1} disabled>Patologias</option>
                            {constants.pathologies.map(p =>
                                <option key={`op-${p.id}`} value={p.id}>{p.name}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label>Tipo de serviço</Form.Label>
                        <Form.Select
                            key={"service-id"}
                            required
                            aria-label="service type selection"
                            name={"serviceTypeId"}
                            defaultValue={-1}
                            onChange={handleInputChange}
                        >
                            <option key={"op-invalid"} value={-1} disabled>Serviço</option>
                            {constants.serviceTypes.map(s =>
                                <option key={`op-${s.id}`} value={s.id}>{s.name}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label>Área terapeutica</Form.Label>
                        <Form.Select
                            key={"therapeutic-area-id"}
                            required
                            aria-label="therapeutica area selection"
                            name={"therapeuticAreaId"}
                            defaultValue={-1}
                            onChange={handleInputChange}
                        >
                            <option key={"op-invalid"} value={-1} disabled>Área terapeuta</option>
                            {constants.therapeuticAreas.map(t =>
                                <option key={`op-${t.id}`} value={t.id}>{t.name}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        {Object.values(ResearchTypes).map((rt, idx) => (
                            <div key={`default-radio-${idx}`} className="mb-3">
                                <Form.Check
                                    key={`default-radio-${idx}`}
                                    required
                                    name={"researchType"}
                                    type={"radio"}
                                    value={rt.id}
                                    label={rt.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                    </Form.Group>

                    {props.formData.researchType === ResearchTypes["CLINICAL_TRIAL"].id
                        ?
                        <>
                            <Form.Group>
                                <Form.Label>Promotor</Form.Label>
                                <Form.Control
                                    key={"promoter-name"}
                                    required={props.formData.researchType === ResearchTypes["CLINICAL_TRIAL"].id}
                                    type={"text"}
                                    name={"promoterName"}
                                    value={props.formData.promoter.promoterName}
                                    onChange={handlePromoterChange}
                                />
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    key={"promoter-email"}
                                    required={props.formData.researchType === ResearchTypes["CLINICAL_TRIAL"].id}
                                    type={"email"}
                                    name={"promoterEmail"}
                                    value={props.formData.promoter.promoterEmail}
                                    onChange={handlePromoterChange}
                                />
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                {Object.values(PromoterTypes).map((p, idx) => (
                                    <div key={`default-radio-${idx}`} className="mb-3">
                                        <Form.Check
                                            key={`promoter-type-${p.id}`}
                                            required={props.formData.researchType === ResearchTypes["CLINICAL_TRIAL"].id}
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
                                    key={"financial-contract-file"}
                                    required={props.formData.researchType === ResearchTypes["CLINICAL_TRIAL"].id}
                                    type={"file"}
                                    name={"file"}
                                    // TODO file save in POSTGRES
                                    onInput={handleFileInput}
                                />
                            </Form.Group>
                        </> : <></>
                    }
                    <Button type={"submit"}>
                        Criar proposta
                    </Button>
                </Container>
            </Form>
        </Col>
    )
}