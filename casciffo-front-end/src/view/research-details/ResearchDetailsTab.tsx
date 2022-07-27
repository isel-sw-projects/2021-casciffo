import {Container, Form, Row} from "react-bootstrap";
import {ResearchModel} from "../../model/research/ResearchModel";
import {useEffect, useState} from "react";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {FormInputHelper} from "./FormInputHelper";

type RDT_Props = {
    research: ResearchModel,
    updateResearch: (data: ResearchModel) => void
    isEditing: boolean
}

export function ResearchDetailsTab(props: RDT_Props) {
    const [dataReady, setDataReady] = useState(false)
    const [research, setResearch] = useState<ResearchModel>({})
    const [previousResearch, setPreviousResearch] = useState<ResearchModel>({})


    useEffect(() => {
        if(props.research?.id != null) {
            setResearch(props.research)
            setPreviousResearch(props.research)
            setDataReady(true)
        }
    }, [props.research])

    const reset = () => setResearch(previousResearch)

    const updateState = (key: keyof ResearchModel, value: unknown) =>
        (
            prevState: ResearchModel
        ): ResearchModel => {
            return ({
                ...prevState,
                [key]: value
            })
        }

    const updateResearch = (e: any) => {
        const key: keyof ResearchModel = e.target.name
        const value: unknown = e.target.value
        setResearch(updateState(key, value))
    }

    return <Container>
        {dataReady &&
            <Form>
                <Row>
                    <FormInputHelper
                        label={"Data início"}
                        value={research.startDate}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                    <FormInputHelper
                        label={"Data prevista de conclusão"}
                        value={research.estimatedEndDate}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                    <FormInputHelper
                        label={"Pacientes previstos"}
                        value={research.estimatedPatientPool}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                    <FormInputHelper
                        label={"Pacientes Atuais"}
                        value={`${research.patients?.length ?? 0}`}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                </Row>
                <Row>
                    <FormInputHelper
                        label={"Sigla"}
                        value={research.proposal!.sigla} />
                    <FormInputHelper
                        label={"Serviço"}
                        value={research.proposal!.serviceType!.name} />
                    <FormInputHelper
                        label={"Área terapeutica"}
                        value={research.proposal!.therapeuticArea!.name} />
                    <FormInputHelper
                        label={"Patologia"}
                        value={research.proposal!.pathology!.name} />
                </Row>
                <Row>
                    <FormInputHelper
                        label={"Investigador Principal"}
                        value={research.proposal!.principalInvestigator!.name} />
                    <FormInputHelper
                        label={"Promotor"}
                        value={research.proposal!.financialComponent?.promoter?.name ?? "Não aplicável"} />
                    <FormInputHelper
                        label={"Financiamento"}
                        value={research.proposal!.financialComponent == null ? "Sem financiamento" : "Com financiamento"} />
                    <FormInputHelper
                        label={"Indústria"}
                        value={research.industry}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                </Row>
                <Row>
                    <FormInputHelper
                        label={"Iniciativa"}
                        value={research.eudra_ct!}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                    <FormInputHelper
                        label={"Protocolo"}
                        value={research.sampleSize!}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                    <FormInputHelper
                        label={"Fases"}
                        value={research.estimatedPatientPool}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                    <FormInputHelper
                        label={"Amostra"}
                        value={research.cro}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                </Row>
                <Row>
                    <FormInputHelper
                        label={"EudraCT"}
                        value={research.eudra_ct!}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                    <FormInputHelper
                        label={"Amostra"}
                        value={research.sampleSize!}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                    <FormInputHelper
                        label={"Doentes previstos"}
                        value={research.estimatedPatientPool}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                    <FormInputHelper
                        label={"CRO"}
                        value={research.cro}
                        editing={props.isEditing}
                        onChange={updateResearch}
                    />
                </Row>
            </Form>
        }
    </Container>
}