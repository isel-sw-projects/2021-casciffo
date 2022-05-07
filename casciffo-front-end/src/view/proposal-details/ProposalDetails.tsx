import ProposalService from "../../services/ProposalService";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {Tab, Tabs} from "react-bootstrap";
import {ProposalDetailsTab} from "./ProposalDetailsTab";

type ProposalDetailsProps = {
    proposalService: ProposalService
}

export function ProposalDetails(props: ProposalDetailsProps) {
    const {proposalId} = useParams()

    const [proposal, setProposal] = useState<ProposalModel>()
    const [isDataReady, setDataReady] = useState(false)
    const [selectedTab, setSelectedTab] = useState("")

    useEffect(() => {
        props.proposalService.fetchById(proposalId).then(setProposal).then(() => setDataReady(true))
    }, [props.proposalService])

    return (
        <Tabs
            id="controlled-tab-example"
            activeKey={selectedTab}
            onSelect={tab => setSelectedTab(tab!)}
            className="mb-3"
        >
            <ProposalDetailsTab proposal={proposal!}/>
            <Tab eventKey="contacts" title="Contactos">
                {/*<Sonnet />*/}
            </Tab>
            <Tab eventKey="observations" title="Observações" disabled>
                {/*<Sonnet />*/}
            </Tab>
            <Tab eventKey="observations" title="Protocolo" disabled>
                {/*<Sonnet />*/}
            </Tab>
            <Tab eventKey="observations" title="Cronologia" disabled>
                {/*<Sonnet />*/}
            </Tab>
        </Tabs>
    )
}