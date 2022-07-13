import {ProposalModel} from "../../model/proposal/ProposalModel";
import {ButtonGroup, Tab} from "react-bootstrap";
import ProposalService from "../../services/ProposalService";
import {StateService} from "../../services/StateService";
import {useState} from "react";
import {StateModel} from "../../model/state/StateModel";
import {STATES} from "../../model/state/STATES";

type PDT_Props = {
    proposal: ProposalModel
    proposalService: ProposalService
    stateService: StateService
}

export function ProposalDetailsTab(props: PDT_Props) {
    const [states, setStates] = useState<StateModel>()


    return (
        <p>hello</p>
    )
}