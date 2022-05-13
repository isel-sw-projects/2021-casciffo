import ProposalService from "../../services/ProposalService";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ProposalModel} from "../../model/proposal/ProposalModel";
import {
    Button,
    ButtonGroup,
    Col,
    Container,
    Form,
    FormControl, ListGroup, ListGroupItem,
    Row,
    Stack,
    Tab,
    Tabs,
    ToggleButton
} from "react-bootstrap";
import {ProposalDetailsTab} from "./ProposalDetailsTab";
import {StateService} from "../../services/StateService";
import {STATES} from "../../model/state/STATES";
import {Util} from "../../common/Util";
import {ResearchTypes} from "../../model/ResearchTypes";

export function ProposalDetails(props: ProposalDetailsProps) {
    const {proposalId} = useParams()

    const [proposal, setProposal] = useState<ProposalModel>({
        dateCreated: undefined,
        dateModified: undefined,
        financialComponent: undefined,
        id: 0,
        investigationTeam: undefined,
        pathology: undefined,
        pathologyId: 0,
        principalInvestigator: undefined,
        principalInvestigatorId: 0,
        serviceType: undefined,
        serviceTypeId: 0,
        sigla: "",
        state: undefined,
        stateId: 0,
        therapeuticArea: undefined,
        therapeuticAreaId: 0,
        type: ""
    })
    const [isDataReady, setDataReady] = useState(false)
    const [selectedTab, setSelectedTab] = useState("proposal")
    const [selectedState, setSelectedState] = useState("")

    useEffect(() => {
        props.proposalService.fetchById(proposalId)
            .then(value => {
                console.log(value);
                return value
            })
            .then(setProposal)
            .then(() => setDataReady(true))
    }, [proposalId, props.proposalService])

    return (
        <Container>
            <Tabs
                id="controlled-tab-example"
                activeKey={selectedTab}
                onSelect={tab => setSelectedTab(tab!)}
                className="mb-3"
            >
                {/*<ProposalDetailsTab*/}
                {/*    proposal={proposal!}*/}
                {/*    proposalService={props.proposalService}*/}
                {/*    stateService={props.stateService}*/}
                {/*/>*/}
                <Tab eventKey="proposal" title="Proposta">
                    <Container className={"align-content-center border-bottom"}>
                        <label>Estado</label>
                        <br/>
                        {
                            isDataReady ?
                                <ButtonGroup className={"mb-3"}>
                                    <ToggleButton
                                        key={`initial-state`}
                                        id={`radio-0`}
                                        type="radio"
                                        variant={selectedState === STATES.SUBMETIDO.id ? 'primary' : 'outline-primary'}
                                        name="radio"
                                        value={STATES.SUBMETIDO.id}
                                        checked={selectedState === STATES.SUBMETIDO.id}
                                        onChange={(e) => setSelectedState(e.currentTarget.value)}
                                    >
                                        <Stack direction={"vertical"}>
                                            <span>{STATES.SUBMETIDO.name}</span>
                                            <span>{Util.formatDate(proposal.dateCreated!)}</span>
                                            <br/>
                                            <span>{STATES.SUBMETIDO.owner}</span>
                                        </Stack>
                                    </ToggleButton>
                                    {/*TODO CLEAN THIS UP ITS MESSY*/}
                                    {Object.values(STATES)
                                        .filter(s => s !== STATES.SUBMETIDO)
                                        .map((state, i) => (
                                            <ToggleButton
                                                key={`${state}-${i}`}
                                                id={`radio-${i}`}
                                                type="radio"
                                                variant={proposal.stateTransitions?.every(st => st.stateAfter?.name !== state.id) ? 'outline-dark':'outline-primary'}
                                                name="radio"
                                                value={state.id}
                                                checked={selectedState === state.id}
                                                disabled={proposal.stateTransitions?.every(st => st.stateAfter?.name !== state.id)}
                                                onChange={(e) => setSelectedState(e.currentTarget.value)}
                                            >
                                                <Stack direction={"vertical"}>
                                                    <span>{state.name}</span>
                                                    {proposal.stateTransitions?.find(st => st.stateAfter?.name === state.id) ?
                                                        <span>{Util.formatDate(proposal.stateTransitions!.find(st => st.stateAfter?.name === state.id)!.transitionDate)}</span>
                                                        :
                                                        <span>{"---"}</span>
                                                    }
                                                    <span>{"Limite ---"}</span>
                                                    <span>{state.owner}</span>
                                                </Stack>
                                            </ToggleButton>
                                        ))}
                                </ButtonGroup>
                                :
                                <span>A carregar estado...</span>
                        }
                    </Container>

                        <Container className={"border"}>
                            {isDataReady ?
                                <Stack direction={"horizontal"}>
                                    <Container>
                                        <Form>
                                            <Row>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Sigla</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"sigla"}
                                                            value={proposal.sigla}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Serviço</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"serviceTypeName"}
                                                            value={proposal.serviceType?.name}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Investigator</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"investigator"}
                                                            value={proposal.principalInvestigator?.name}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className={"mb-3"}>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Área terapeutica</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"therapeuticArea"}
                                                            value={proposal.therapeuticArea?.name}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group>
                                                        <Form.Label>Patologia</Form.Label>
                                                        <Form.Control
                                                            type={"text"}
                                                            name={"pathology"}
                                                            value={proposal.pathology?.name}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    {proposal.type === ResearchTypes.CLINICAL_TRIAL.id ?
                                                        <Form.Group>
                                                            <Form.Label>Promotor</Form.Label>
                                                            <Form.Control
                                                                type={"text"}
                                                                name={"promoterName"}
                                                                value={proposal.financialComponent?.promoter.name}
                                                                disabled
                                                            />
                                                        </Form.Group>
                                                        : <></>
                                                    }
                                                </Col>
                                            </Row>

                                        </Form>
                                    </Container>
                                    <Container className={"border"}>
                                        <label>Equipa</label>
                                        <ListGroup style={{overflow: 'auto', maxHeight: 400}}>
                                            {/*TODO eventually add a way to seperate the columns or add overflow*/}
                                            {proposal.investigationTeam!.map((team, idx) => (
                                                <ListGroup.Item
                                                    as="li"
                                                    className="d-flex justify-content-between align-items-start"
                                                    style={{backgroundColor: (idx & 1) === 1 ? 'white' : 'whitesmoke'}}
                                                    key={`${team.member?.name}-${idx}`}
                                                >
                                                    <small>
                                                        <div className="ms-2 me-auto">
                                                            <div className="fw-bold">{team.member?.name}</div>
                                                            {team.member?.email}
                                                        </div>
                                                    </small>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Container>
                                </Stack>
                                : <span>A carregar dados...</span>
                            }
                        </Container>
                </Tab>
                <Tab eventKey="contacts" title="Contactos">
                    {/*<Sonnet />*/}
                </Tab>
                <Tab eventKey="observations" title="Observações">
                    {/*<Sonnet />*/}
                </Tab>
                <Tab eventKey="protocol" title="Protocolo">
                    {/*<Sonnet />*/}
                </Tab>
                <Tab eventKey="chronology" title="Cronologia">
                    {/*<Sonnet />*/}
                </Tab>
            </Tabs>
        </Container>
    )
}

type ProposalDetailsProps = {
    proposalService: ProposalService
    stateService: StateService
}
