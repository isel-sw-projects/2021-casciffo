import {ProposalModel} from "../../model/proposal/ProposalModel";
import {Tab} from "react-bootstrap";

type PDT_Props = {
    proposal: ProposalModel
}

export function ProposalDetailsTab(props: PDT_Props) {
    return (
        <Tab eventKey="proposal" title="Proposta">

        </Tab>
    )
}