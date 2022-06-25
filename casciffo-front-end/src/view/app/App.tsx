import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/main/app.css";
import "../../assets/css/shared/iconly.css";
import {Container, Nav, Navbar, Stack} from 'react-bootstrap';
import {BrowserRouter as Router, Link, Route, Routes, useLocation} from "react-router-dom";
import {CreateProposal} from '../proposal-form-view/CreateProposal'
import {Proposals} from '../proposals-view/Proposals';
import ProposalAggregateService from "../../services/ProposalAggregateService";
import ProposalService from "../../services/ProposalService";
import {ProposalDetails} from "../proposal-details-view/ProposalDetails";
import RequiresAuth from "../login-view/RequiresAuth";
import {Dashboard} from "./Dashboard";
import {Login} from "../login-view/Login";
import {UserService} from "../../services/UserService";
import {useToken} from "../../custom_hooks/useToken";
import {Research} from "../researches-view/Research";
import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import {ResearchDetails} from "../researches-view/ResearchDetails";

function NavigationBar() {
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Collapse>
                    <Navbar.Brand as={Link} to={"/"}>Casciffo</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={"/"}>Dashboard</Nav.Link>
                        <Nav.Link as={Link} to={"/propostas"}>Propostas</Nav.Link>
                        <Nav.Link as={Link} to={"/ensaios"}>Ensaios Clínicos</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function CreateRoutes() {
    const [_, setToken] = useToken()

    return (
        <Routes>
            <Route path={"/"} element={<Dashboard/>}/>
            <Route path={"/login-view"} element={<Login UserService={new UserService()} setToken={setToken}/>}/>
            <Route path={"/propostas"}
                   element={RequiresAuth(<Proposals service={new ProposalService()}/>)}/>
            <Route path={"/propostas/criar"}
                element={RequiresAuth(<CreateProposal
                    service={new ProposalAggregateService()}
                />)}
            />
            <Route path={"/propostas/:proposalId"}
                   element={RequiresAuth(<ProposalDetails proposalService={new ProposalAggregateService()}/>)}
            />
            <Route path={"/ensaios"}
                element={RequiresAuth(<Research researchService={new ResearchAggregateService()}/>)}
            />
            <Route path={"/ensaios/:researchId"}
                element={RequiresAuth(<ResearchDetails researchService={new ResearchAggregateService()}/>)}
            />
        </Routes>
    );
}


function DisplayPath() {
    const path = useLocation()
    let pathVariables = [path.pathname]
    if(path.pathname.length > 1) pathVariables = path.pathname.split("/")

    let displayPath : Array<string> = []
    displayPath.push("Início")
    for (let i = 1; i < pathVariables.length; i++) {
        let currPathVariable = pathVariables[i]
        displayPath.push(currPathVariable)
        pathVariables[i] = pathVariables[i - 1].concat("/",pathVariables[i])
    }
    pathVariables[0] = "/"
    return (
        <Container key={"curret-path"} className={"mb-1 mt-2"}>
            <Stack direction={"horizontal"} gap={2}>
                {displayPath.map((p, i) =>
                    <p key={p+i}>{`\u27A4 `}<Link to={pathVariables[i]} className={"text-capitalize"}>{p}</Link></p>)}
            </Stack>
        </Container>
    )
}

function App() {

    return (
        <>
            <Router basename={"/"} key={"router"}>
                <NavigationBar/>
                <DisplayPath/>
                <CreateRoutes/>
            </Router>

        </>
    );
}

export default App;
