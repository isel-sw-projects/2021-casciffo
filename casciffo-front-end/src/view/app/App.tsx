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
import {Research} from "../researches-view/Research";
import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import {ResearchDetails} from "../researches-view/ResearchDetails";
import {Logout} from "../login-view/Logout";
import {useUserAuthContext} from '../context/UserAuthContext';
import {ErrorBoundary} from "react-error-boundary";
import {GlobalErrorBoundary} from "../error-view/GlobalErrorBoundary";
import {Roles} from "../../model/role/Roles";
import {Users} from "../users-view/Users";
import {CgUser} from "react-icons/cg";
import {AiOutlineUser} from "react-icons/ai";
import  {BiUser}    from "react-icons/bi";
import {FaUser}   from "react-icons/fa";
import {FiUser}  from "react-icons/fi";
import {HiUser} from "react-icons/hi";

function NavigationBar() {

    const {userToken, setUserToken} = useUserAuthContext()

    const logout = () => setUserToken(null)
    return (
        <Navbar className={"ml-auto flex-fill"} bg="primary" variant="dark">
            <Container>
                <Navbar.Collapse>
                    <Navbar.Brand as={Link} to={"/"}>Casciffo</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={"/"}>Dashboard</Nav.Link>
                            {userToken != null ?
                                <Nav.Link as={Link} to={"/logout"} onClick={logout}>Logout</Nav.Link>
                                :
                                <Nav.Link as={Link} to={"/login"}>Login</Nav.Link>
                            }
                        <Nav.Link as={Link} to={"/propostas"}>Propostas</Nav.Link>
                        <Nav.Link as={Link} to={"/ensaios"}>Ensaios Clínicos</Nav.Link>
                        {
                            userToken && userToken.roles.find(r => r === Roles.SUPERUSER.id) &&
                            <Nav.Link as={Link} to={"/users"}>Utilizadores</Nav.Link>
                        }
                        {/*add div with user icon and Olá {userToken.name}*/}
                        {/*{userToken &&*/}
                        {/*    <Nav.Link className={"float-end"} as={Link} to={`/user/${userToken.userId}`}>{userToken.userName}</Nav.Link>*/}
                        {/*}*/}
                    </Nav>
                </Navbar.Collapse>
                    {/*username not displaying, get inside a container and then magic happens probably*/}
                <div className={"flex-column"}>
                    <Stack direction={"vertical"} className={"flex-column"}>
                        <FaUser className={"float-end"} color={"white"} style={{position: "relative", left: 30}}/>
                        {userToken && <span className={"float-start"} style={{color:"white"}}>Olá {userToken.userName}!</span>}
                    </Stack>
                </div>
            </Container>
            {/*<Container className={"float-end"}>*/}
            {/*    */}
            {/*    {userToken && <span>Olá {userToken.userName}!</span>}*/}
            {/*</Container>*/}
        </Navbar>
    );
}

function CreateRoutes() {

    return (
        <Routes>
            <Route path={"/"} element={<Dashboard/>}/>
            <Route path={"/login"} element={<Login UserService={new UserService()}/>}/>
            <Route path={"/logout"} element={<Logout/>}/>
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
            {/*<Route path={"/ensaios"}*/}
            {/*    element={RequiresAuth(<Research researchService={new ResearchAggregateService()}/>)}*/}
            {/*/>*/}
            {/*<Route path={"/ensaios/:researchId"}*/}
            {/*    element={RequiresAuth(<ResearchDetails researchService={new ResearchAggregateService()}/>)}*/}
            {/*/>*/}
            {/*<Route path={"/users"}*/}
            {/*       element={RequiresAuth(<Users service={new UserService()}/>)}/>*/}
            {/*<Route path={"/users/:userId"}*/}
            {/*       element={RequiresAuth(<Users service={new UserService()}/>)}/>*/}


        </Routes>
    );
}


function DisplayPath() {
    const path = useLocation()
    let pathVariables = [path.pathname]
    if(path.pathname.length <= 1) return <div className={"mb-1 mt-3"}/>

    pathVariables = path.pathname.split("/")

    let displayPath : Array<{ link:string, displayName:string }> = []
    displayPath.push({
        link: "/",
        displayName: "Início"
    })
    for (let i = 1; i < pathVariables.length; i++) {
        let currPathVariable = {
            link: pathVariables[i - 1].concat("/",pathVariables[i]),
            displayName: pathVariables[i]
        }
        displayPath.push(currPathVariable)
    }
    return (
        <Container key={"curret-path"} className={"mb-1 mt-3"}>
            <Stack direction={"horizontal"} gap={2}>
                {displayPath.map((p, i) =>
                    <p key={p.link+i}>{`\u27A4 `}<Link to={p.link} className={"text-capitalize"}>{p.displayName}</Link></p>)}
            </Stack>
        </Container>
    )
}

function App() {
    return (
        <Router basename={"/"} key={"router"}>
            <ErrorBoundary FallbackComponent={GlobalErrorBoundary}>
                <NavigationBar/>
                <DisplayPath/>
                <CreateRoutes/>
            </ErrorBoundary>
        </Router>
    )
}

export default App;
