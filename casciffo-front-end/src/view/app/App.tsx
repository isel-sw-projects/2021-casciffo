import React from 'react';
import logo from '../../logo.svg';
import './App.css';
import {Container, Nav, Navbar, Stack} from 'react-bootstrap';
import {BrowserRouter as Router, Link, Route, Routes, useNavigate} from "react-router-dom";
import {CreateProposal} from '../proposal-form/CreateProposal'
import { Proposals } from '../proposals/Proposals';
import ProposalAggregateService from "../../services/ProposalAggregateService";


function NavigationBar() {
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Collapse>
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
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
        <Route path={"/propostas"} element={<Proposals/>}/>
        <Route
            path={"/propostas/criar"}
            element={<CreateProposal
                service={new ProposalAggregateService()}
            />}
        />
    </Routes>;
}

function buildCurrentPathAsLinks() {
    let pathVariables = window.location.pathname.split("/").slice(3) //ignores {first /, api, casciffo}
    let path : Array<string> = []
    pathVariables = ["/", ...pathVariables]
    path.push("Início")
    for (let i = 1; i < pathVariables.length; i++) {
        path.push(pathVariables[i])
        console.log(path)
        pathVariables[i] = pathVariables[i - 1].concat("/",pathVariables[i])
    }
    return (
        <Container key={"curret-path"} className={"mb-1 mt-2"}>
            <Stack direction={"horizontal"} gap={2}>
                {path.map((path, idx) =>
                    <p key={path+idx}>{`\u27A4 `}<Link to={pathVariables[idx]} >{path}</Link></p>)}
            </Stack>
        </Container>
    )
}

function App() {

    return (
        <>
            <Router basename={"/api/casciffo"} key={"router"}>
                <NavigationBar/>
                {buildCurrentPathAsLinks()}
                <CreateRoutes/>
            </Router>

        </>
    );
}

export default App;
