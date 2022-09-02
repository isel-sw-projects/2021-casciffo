import {PatientModel, ResearchVisitModel} from "../../../model/research/ResearchModel";
import {Breadcrumb, Button, Container, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {FormInputHelper} from "../research/FormInputHelper";
import {useParams} from "react-router-dom";
import {MyUtil} from "../../../common/MyUtil";

type Props = {
    fetchPatient: (researchId: string, patientId: string) => Promise<PatientModel>
    visits: ResearchVisitModel[],
    onRenderOverviewClick: () => void
}

export function PatientDetails(props: Props) {
    const {researchId} = useParams()
    const [patientProcessNum, setPatientProcessNum] = useState("")

    useEffect(() => {
        document.title = MyUtil.RESEARCH_PATIENT_DETAILS_TITLE(researchId!, patientProcessNum)
    }, [researchId, patientProcessNum])

    return <React.Fragment>
        <Container className={"border-top border-2 border-secondary"}>
            <Breadcrumb className={"m-2 m-md-2 flex"}>
                <Breadcrumb.Item className={"font-bold"} onClick={props.onRenderOverviewClick}>Pacientes</Breadcrumb.Item>
                <Breadcrumb.Item className={"font-bold"} active>Detalhes</Breadcrumb.Item>
            </Breadcrumb>
        </Container>

        <Container className={"flex border-end border-2 border-secondary justify-content-start"}>
            <Form>
              <FormInputHelper label={"Nº Processo"}/>
              <FormInputHelper label={"Nome"}/>
              <FormInputHelper label={"Idade"}/>
              <FormInputHelper label={"Género"}/>
            </Form>
        </Container>

        <Container className={"flex border-start border-2 border-secondary justify-content-evenly"}>

        </Container>
    </React.Fragment>
}