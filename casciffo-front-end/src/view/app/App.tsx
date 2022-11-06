import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/main/app.css";
import "../../assets/css/shared/iconly.css";
import {Button, Col, Container, Nav, Navbar, Row, Stack} from 'react-bootstrap';
import {BrowserRouter, Link, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useUserAuthContext} from '../context/UserAuthContext';
import {Roles} from "../../model/role/Roles";
import {FaUser} from "react-icons/fa";
import {BsDoorOpen} from "react-icons/bs";
import {GiExitDoor} from "react-icons/gi";
import {StatisticsService} from "../../services/StatisticsService";
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {UserService} from "../../services/UserService";
import {ErrorBoundary} from "react-error-boundary";
import {Dashboard} from "./Dashboard";
import {ResearchDetailsPage} from "../research-details/research/ResearchDetailsPage";
import {Login} from "../login-view/Login";
import {Research} from "../researches-view/Research";
import {Users} from "../users-view/Users";
import {Proposals} from "../proposals-view/Proposals";
import ProposalService from "../../services/ProposalService";
import RequiresAuth from "../login-view/RequiresAuth";
import {ProposalDetailsPage} from "../proposal-details-view/proposal/ProposalDetailsPage";
import {ResearchAggregateService} from "../../services/ResearchAggregateService";
import {GlobalErrorBoundary} from "../error-view/GlobalErrorBoundary";
import {Logout} from "../login-view/Logout";
import {CreateProposal} from "../proposal-form-view/CreateProposal";
import {NotificationService} from "../../services/NotificationService";
import {NotificationsView} from "../notifications/NotificationsView";
import {MyUtil} from "../../common/MyUtil";
import {Tooltip, IconButton as MuiIconButton, Badge as MuiBadge}  from "@mui/material";
import {MdNotificationImportant} from "react-icons/md";
import {IoMdNotifications} from "react-icons/io";

function NavigationBar(props: {notificationService: NotificationService}) {

    const {userToken, setUserToken} = useUserAuthContext()
    const navigate = useNavigate()
    const logout = () => {
        setUserToken(null)
        navigate('/logout')
    }

    const [notificationCount, setNotificationCount] = useState(0)

    useEffect(() => {
        if(userToken == null) return
        const interval = setInterval(() => {
            console.log("Checking for new notifications...")
            props.notificationService
                .checkForNewNotifications(userToken!.userId!)
                .then(value => {console.log(`Found ${value} new notifications.`); return value;})
                .then(setNotificationCount)
        }, MyUtil.convertMinutesToMillis(15))
        return () => clearInterval(interval)
    }, [props.notificationService, userToken])

    return (
        //FIXME BACKGROUND ON MOBILE IS TRANSPARENT FOR GOD KNOWS WHAT REASON
        <Navbar collapseOnSelect className={"ml-auto flex-fill"} bg="primary" variant="dark" expand="lg">
            <Navbar.Toggle  title={"Menu"}/>
            <Navbar.Collapse>
                <Navbar.Brand as={Link} to={"/"}>Casciffo</Navbar.Brand>
                <Nav className="me-auto">
                    { userToken && <>
                        <Nav.Item>
                            <Nav.Link eventKey="1" as={Link} to={"/"}>Dashboard</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="4" as={Link} to={"/propostas"}>Propostas</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="5" as={Link} to={"/ensaios"}>Ensaios Clínicos</Nav.Link>
                        </Nav.Item>

                        {userToken.roles.find(r => r === Roles.SUPERUSER.id) &&
                        <Nav.Item>
                            <Nav.Link eventKey="6" as={Link} to={"/utilizadores"}>Utilizadores</Nav.Link>
                        </Nav.Item>
                    } </>}
                    {/*<Nav.Item className={"float-end"}>*/}
                    {/*    {userToken != null ?*/}
                    {/*        <Nav.Link eventKey="2" as={Link} to={"/logout"} onClick={logout}>Logout</Nav.Link>*/}
                    {/*        :*/}
                    {/*        <Nav.Link eventKey="3" as={Link} to={"/login"}>Login</Nav.Link>*/}
                    {/*    }*/}
                    {/*</Nav.Item>*/}
                </Nav>
            </Navbar.Collapse>
            <div style={{width:"20%"}}>
                <Row className={"text-center"}>
                    <Col className={"text-center"}>
                        {userToken != null &&
                            <Link to={`/utilizadores/${userToken.userId}/notificacoes`}>
                                <Tooltip title={"Notificações"}>
                                        <MuiBadge style={{top:10}} badgeContent={notificationCount} color={"warning"}>
                                            {notificationCount === 0
                                                ? <IoMdNotifications color={"#ffffff"} size={25}/>
                                                : <MdNotificationImportant color={"#ffffff"} size={25}/>
                                            }
                                        </MuiBadge>
                                </Tooltip>
                            </Link>
                        }
                    </Col>
                    <Col>
                        <div >
                            {userToken != null &&
                                <FaUser size={20} color={"#f3ffff"} />
                            }
                        </div>
                    </Col>
                    <Col>
                            {userToken != null ?
                                <GiExitDoor size={20} color={"#f3ffff"} />
                                :
                                <BsDoorOpen size={20} color={"#f3ffff"} />
                            }
                    </Col>
                </Row>
                <Row className={"text-center"}>
                    <Col/>
                    <Col>
                        <p className={"mt-2 mt-md-2 text-capitalize"} style={{color:"#f3ffff", top:5}}>
                        {userToken && userToken.userName}
                        </p>
                    </Col>
                    <Col>
                       {userToken != null ?
                           <Button className={"font-bold"} style={{color: "white"}} variant={"link"} onClick={logout}>Logout</Button>
                           :
                           <Button className={"font-bold"} style={{color: "white"}} variant={"link"} onClick={() => navigate("/login")}>Login</Button>
                       }
                    </Col>
                </Row>
            </div>
        </Navbar>
    );
}

function CreateRoutes() {

    return (
        <Routes>
            {/*<Route path={"/"} element={<Homepage/>}/>*/}
            <Route path={"/"} element={RequiresAuth(<Dashboard statisticsService={new StatisticsService()}/>)}/>
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
                   element={RequiresAuth(<ProposalDetailsPage proposalService={new ProposalAggregateService()}/>)}
            />

            <Route path={"/ensaios"}
                element={RequiresAuth(<Research researchService={new ResearchAggregateService()}/>)}
            />

            <Route path={"/ensaios/:researchId"}
                element={RequiresAuth(<ResearchDetailsPage researchService={new ResearchAggregateService()}/>)}
            />

            <Route path={"/utilizadores"}
                   element={RequiresAuth(<Users service={new UserService()}/>)}/>

            <Route path={"/utilizadores/:userId/notificacoes"}
                   element={RequiresAuth(<NotificationsView service={new NotificationService()}/>)}/>
            {/*<Route path={"/users/:userId"}*/}
            {/*       element={RequiresAuth(<UserDetails service={new UserService()}/>)}/>*/}


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
        <BrowserRouter basename={"/"} key={"router"}>
            <ErrorBoundary FallbackComponent={GlobalErrorBoundary}>
                <NavigationBar notificationService={new NotificationService()}/>
                <DisplayPath/>
                <CreateRoutes/>
            </ErrorBoundary>
        </BrowserRouter>
    )
}

export default App;
