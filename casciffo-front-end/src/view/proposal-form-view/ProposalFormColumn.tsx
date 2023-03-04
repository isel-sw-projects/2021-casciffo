import {Alert, Button, Col, Form} from "react-bootstrap";

import React, {useEffect, useState} from "react";
import {ConstantsModel, Investigator, ProposalForm} from "../../common/Types";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {PromoterModel} from "../../model/proposal/finance/PromoterModel";
import {PartnershipModel} from "../../model/proposal/finance/PartnershipModel";
import {PromoterTypes, ResearchTypes} from "../../common/Constants";
import {RequiredLabel} from "../components/RequiredLabel";
import {RequiredSpan} from "../components/RequiredSpan";
import {Divider} from "@mui/material";

type PFC_Props = {
    onSubmit: () => void,
    service: ProposalAggregateService,
    setHasPartnerships: (state: boolean) => void,
    hasPartnerships: boolean,
    setFormData: (updateState: (prevState: ProposalForm) => ProposalForm) => void,
    formData: ProposalForm
}

type EventValue = string | PromoterModel | Array<Investigator | PartnershipModel> | File | Investigator
type ReactGeneralInputValue = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
type ProposalFormKey = keyof ProposalForm

export function ProposalFormColumn(props: PFC_Props) {

    const [errorState, setErrorState] = useState({show: false, message: ""})

    const [constants, setConstants] = useState<ConstantsModel>({
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
        let propKey = event.target.name as keyof ProposalForm
        let value = event.target.value
        props.setFormData(updateState(propKey, value))
    }

    function handleResearchTypeChange(e: any) {
        const newVal = e.target.value
        if(newVal === ResearchTypes.OBSERVATIONAL_STUDY.id && props.hasPartnerships) props.setHasPartnerships(false)

        props.setFormData(updateState("researchType", newVal))
    }

    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); //stop redirect
        const form = event.currentTarget;
        //if a proposal is marked with having partnerships, it must have a least 1 partnership
        const isPartnershipsValid = props.formData.partnerships.length !== 0 || !props.hasPartnerships

        const isInvestigatorValid = props.formData.pInvestigator.id.length !== 0
        if (!form.checkValidity() || !isPartnershipsValid || !isInvestigatorValid) {
            if(!isPartnershipsValid) showErrorMessage("Ao indicar que existem parcerias, a proposta tem de ter pelo menos uma parceria válida.")
            if(!isInvestigatorValid) showErrorMessage("Por favor escolha um investigador da lista de resultados.")
            event.stopPropagation();
            return
        }
        props.onSubmit()
    }
    function handlePromoterChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        const key = event.target.name as keyof PromoterModel
        const p = {
            ...props.formData.promoter,
            [key]: value
        }
        props.setFormData(updateState("promoter", p))
    }
    function handlePromoterTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value
        const key = event.target.name as keyof PromoterModel
        const p = {
            ...props.formData.promoter,
            [key]: value
        }
        props.setFormData(updateState("promoter", p))
    }

    function showErrorMessage(msg: string) {
        setErrorState({show: true, message: msg})
        setTimeout(() => {
            setErrorState({show: false, message: ""})
        }, 8000)
    }

    function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
        if(event.target.files === null) {
            event.preventDefault()
            event.stopPropagation()
            return
        }
        let file = event.target.files.item(0)

        if(file === null) {
            showErrorMessage("Falha ao carregar ficheiro, por favor tente de novo.");
            return;
        }
        props.setFormData(updateState("file", file))
    }

    const [isClinicalTrial, setIsClinicalTrial] = useState(false)

    useEffect(() => {
      setIsClinicalTrial(props.formData.researchType === ResearchTypes["CLINICAL_TRIAL"].id)
    }, [props.formData.researchType])

    return (
        <Col sm={12} md={4} key={"proposal-form-col"} className="border border-dark">
            <Alert
                variant={"danger"}
                show={errorState.show}
                onClose={() => setErrorState({show: false, message: ""})}
                dismissible
            >
                {errorState.message}
            </Alert>
            <Form onSubmit={handleFormSubmit}>
                <h5 className={"text-center m-2"}>Proposta</h5>
                <Divider/>
                <br/>
                <br/>
                <Form.Group className="mb-3" controlId="formBasicInput">
                    <RequiredLabel label={"Sigla"}/>
                    <Form.Control
                        key={"sigla"}
                        required
                        type={"text"}
                        name={"sigla"}
                        placeholder={"Sigla"}
                        value={props.formData.sigla}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group>
                    <RequiredLabel label={"Patologia"}/>
                    <Form.Select
                        key={"pathology-id"}
                        required
                        aria-label="Default select example"
                        name={"pathologyId"}
                        defaultValue={""}
                        onChange={handleInputChange}
                    >
                        <option key={"op-invalid"} value={""} disabled>-Patologias-</option>
                        {constants.pathologies.map(p =>
                            <option key={`op-${p.id}`} value={p.id}>{p.name}</option>
                        )}
                    </Form.Select>
                </Form.Group>
                <br/>
                <Form.Group>
                    <RequiredLabel label={"Tipo de serviço"}/>
                    <Form.Select
                        key={"service-id"}
                        required
                        aria-label="service type selection"
                        name={"serviceTypeId"}
                        defaultValue={""}
                        onChange={handleInputChange}
                    >
                        <option key={"op-invalid"} value={""} disabled>-Serviço-</option>
                        {constants.serviceTypes.map(s =>
                            <option key={`op-${s.id}`} value={s.id}>{s.name}</option>
                        )}
                    </Form.Select>
                </Form.Group>
                <br/>
                {/*TODO use searchable select*/}
                <Form.Group>
                    <RequiredLabel label={"Área terapeutica"}/>
                    <Form.Select
                        key={"therapeutic-area-id"}
                        required
                        aria-label="therapeutica area selection"
                        name={"therapeuticAreaId"}
                        defaultValue={""}
                        onChange={handleInputChange}
                    >
                        <option key={"op-invalid"} value={""} disabled>-Área terapeutica-</option>
                        {constants.therapeuticAreas.map(t =>
                            <option key={`op-${t.id}`} value={t.id}>{t.name}</option>
                        )}
                    </Form.Select>
                </Form.Group>
                <br/>
                <Form.Group controlId={"research-type-select-group"}>
                    <RequiredLabel label={"Tipo de estudo"}/>
                    <br/>
                    {Object.values(ResearchTypes).map((rt, idx) => (
                        <div key={`default-div-radio-${idx}`} className="mb-2" >
                            <Form.Check
                                required
                                key={`default-radio-${idx}`}
                                id={`default-radio-id-${idx}`}
                                label={rt.singularName}
                                name={"researchType"}
                                type={"radio"}
                                value={rt.id}
                                onChange={handleResearchTypeChange}
                            />
                        </div>

                    ))}
                </Form.Group>
                <br/>
                <Form.Group className={"mb-3 flex-row"} controlId={"partnerships-switch-group"}>
                    <label htmlFor={"partnerships-switch-group"} className={"font-bold"}>Parcerias</label>
                    <Form.Check
                        className={"ms-2 d-inline"}
                        key={"partnerships-switch"}
                        type={"switch"}
                        name={"hasPartnerships"}
                        disabled={!isClinicalTrial}
                        checked={props.hasPartnerships}
                        onChange={(() => props.setHasPartnerships(!props.hasPartnerships))}
                    />

                </Form.Group>

                {isClinicalTrial
                    &&
                    <>
                        <fieldset>
                            <h5>Promotor</h5>
                            <Form.Group>
                                <Form.FloatingLabel className={"font-bold"} label={<RequiredSpan text={"Nome"}/>}>
                                    <Form.Control
                                        key={"promoter-name"}
                                        required={isClinicalTrial}
                                        type={"text"}
                                        name={"name"}
                                        placeholder={"Nome"}
                                        value={props.formData.promoter.name}
                                        onChange={handlePromoterChange}
                                    />
                                </Form.FloatingLabel>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.FloatingLabel className={"font-bold"} label={<RequiredSpan text={"Email"}/>}>
                                    <Form.Control
                                        key={"promoter-email"}
                                        required={isClinicalTrial}
                                        placeholder={"Email"}
                                        type={"email"}
                                        name={"email"}
                                        value={props.formData.promoter.email}
                                        onChange={handlePromoterChange}
                                    />
                                </Form.FloatingLabel>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <RequiredLabel label={"Tipo de promotor"}/>
                                <Form.Select
                                    key={"therapeutic-area-id"}
                                    required={isClinicalTrial}
                                    aria-label="therapeutica area selection"
                                    name={"therapeuticAreaId"}
                                    defaultValue={""}
                                    onChange={handlePromoterTypeChange}
                                >
                                    <option key={"op-invalid"} value={""} disabled>-Tipo de promotor-</option>
                                    {Object.values(PromoterTypes).map((p, idx) => (
                                        <option key={`default-radio-${idx}`} value={p.id}>
                                            {p.name}
                                        </option>))}
                                </Form.Select>
                            </Form.Group>
                            <br/>
                            <Form.Group controlId="formFile" className="mb-3">
                                <RequiredLabel label={"Contrato financeiro"}/>
                                <Form.Control
                                    key={"financial-contract-file"}
                                    required={props.formData.researchType === ResearchTypes.CLINICAL_TRIAL.id}
                                    type={"file"}
                                    name={"file"}
                                    onInput={handleFileInput}
                                />
                            </Form.Group>
                        </fieldset>
                    </>
                }
                <Button type={"submit"} className={"mb-2"} style={{borderRadius: "8px"}}>
                    Criar proposta
                </Button>
            </Form>
        </Col>
    )
}