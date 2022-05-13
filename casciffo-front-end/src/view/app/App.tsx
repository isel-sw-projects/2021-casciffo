import React, {useState} from 'react';
import logo from '../../logo.svg';
import './App.css';
import {Container, Nav, Navbar, Stack} from 'react-bootstrap';
import {BrowserRouter as Router, Link, Route, Routes, useLocation} from "react-router-dom";
import {CreateProposal} from '../proposal-form/CreateProposal'
import { Proposals } from '../proposals/Proposals';
import ProposalAggregateService from "../../services/ProposalAggregateService";
import ProposalService from "../../services/ProposalService";
import {ProposalDetails} from "../proposal-details/ProposalDetails";
import {StateService} from "../../services/StateService";


function NavigationBar() {
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Collapse>
                    <Navbar.Brand href="#home">Casciffo</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={"/propostas"}>Propostas</Nav.Link>
                        <Nav.Link as={Link} to={"/"}>Inicio</Nav.Link>
                        <Nav.Link as={Link} to={"/research"}>Ensaios e Estudos</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function CreateRoutes() {
    return <Routes>
        <Route path={"/"} element={<>Home</>}/>
        <Route path={"/propostas"} element={<Proposals service={new ProposalService()}/>}/>
        <Route
            path={"/propostas/criar"}
            element={<CreateProposal
                service={new ProposalAggregateService()}
            />}
        />
        <Route
            path={"/propostas/:proposalId"}
            element={<ProposalDetails
                proposalService={new ProposalService()}
                stateService={new StateService()}
            />}
        />
    </Routes>;
}


function DisplayPath() {
    const path = useLocation()
    let pathVariables = path.pathname.split("/").filter(s => s.length !== 0)
    let displayPath : Array<string> = []
    pathVariables = ["/", ...pathVariables]
    displayPath.push("Início")
    for (let i = 1; i < pathVariables.length; i++) {
        let currPathVariable = pathVariables[i]
        currPathVariable = currPathVariable.charAt(0).toUpperCase().concat(currPathVariable.substring(1))
        displayPath.push(currPathVariable)
        pathVariables[i] = pathVariables[i - 1].concat("/",pathVariables[i])
    }
    return (
        <Container key={"curret-path"} className={"mb-1 mt-2"}>
            <Stack direction={"horizontal"} gap={2}>
                {displayPath.map((p, i) =>
                    <p key={p+i}>{`\u27A4 `}<Link to={pathVariables[i]}>{p}</Link></p>)}
            </Stack>
        </Container>
    )
}

function App() {

    return (
        <>
            <Router key={"router"}>
                <NavigationBar/>
                <DisplayPath/>
                <CreateRoutes/>
            </Router>

        </>
    );
}

export default App;
