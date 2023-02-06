import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/main/app.css";
import "../../assets/css/shared/iconly.css";
import 'react-toastify/dist/ReactToastify.css';
import {Button, Container, Nav, Navbar, Stack} from 'react-bootstrap';
import {BrowserRouter, Link, useLocation, useNavigate} from "react-router-dom";
import {UserAuthContextProvider, useUserAuthContext} from '../context/UserAuthContext';
import {Roles} from "../../model/role/Roles";
import {ErrorBoundary} from "react-error-boundary";
import {GlobalErrorBoundary} from "../error-view/GlobalErrorBoundary";
import {NotificationService} from "../../services/NotificationService";
import {MyUtil} from "../../common/MyUtil";
import {Tooltip, Badge as MuiBadge, Grid} from "@mui/material";
import {CreateRoutes} from "./CreateRoutes";
// !!! IMPORTANT !!! react-icons imports !!!MUST!!! be imported like this, by specifying the folder
// which is the prefix of the desired icon. Having the default /all will cause the app to crash.
import {FaUser} from "react-icons/fa";
import {BsDoorOpen} from "react-icons/bs";
import {GiExitDoor} from "react-icons/gi";
import {MdNotificationImportant} from "react-icons/md";
import {IoMdNotifications} from "react-icons/io";
import {NOTIFICATION_CHECK_INTERVAL_MINUTES} from "../../common/Constants";
import {NotificationContextProvider, useNotificationContext} from "../context/NotificationContext";

function NavigationBar(props: {notificationService: NotificationService}) {

    const {userToken, setUserToken} = useUserAuthContext()
    const navigate = useNavigate()
    const logout = () => {
        setUserToken(null)
        navigate('/logout')
    }

    const {notificationCount, setNotificationCount} = useNotificationContext()

    useEffect(() => {
        if(userToken == null) return
        const interval = setInterval(() => {
            props.notificationService
                .checkForNewNotifications(userToken!.userId!)
                .then(setNotificationCount)
        }, MyUtil.convertMinutesToMillis(NOTIFICATION_CHECK_INTERVAL_MINUTES))
        return () => clearInterval(interval)
    }, [props.notificationService, setNotificationCount, userToken])

    const isUserAdmin = userToken && userToken.roles.find(r => r === Roles.SUPERUSER.id) != null

    return (
        <Navbar collapseOnSelect className={"ml-auto flex-fill"} bg="primary" variant="dark" expand="lg">
            <Navbar.Toggle  title={"Menu"}/>
            <Navbar.Collapse style={{backgroundColor: "#435ebe", width: "80%"}}>
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

                        { isUserAdmin && <>
                            <Nav.Item>
                                <Nav.Link eventKey="6" as={Link} to={"/utilizadores"}>Utilizadores</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={7} as={Link} to={"/dados"}>Gestão de Dados</Nav.Link>
                            </Nav.Item>
                            </>
                        }
                    </>}
                </Nav>

                <div className={"float-end"}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{backgroundColor: "#435ebe", top:20}}>
                        <Grid item xs={4} className={"text-center"}>
                            {userToken != null &&
                                <Link to={`/utilizadores/${userToken.userId}/notificacoes`}>
                                    <Tooltip title={"Notificações"}>
                                            <MuiBadge badgeContent={notificationCount} color={"warning"}>
                                                {notificationCount === 0
                                                    ? <IoMdNotifications color={"#ffffff"} size={25}/>
                                                    : <MdNotificationImportant color={"#ffffff"} size={25}/>
                                                }
                                            </MuiBadge>
                                    </Tooltip>
                                </Link>
                            }
                        </Grid>
                        <Grid item xs={4} className={"text-center"}>
                                {userToken != null &&
                                    <FaUser size={20} color={"#f3ffff"} style={{top: "0px"}}/>
                                }
                        </Grid>
                        <Grid item xs={4} className={"text-center"}>
                                {userToken != null ?
                                    <GiExitDoor size={20} color={"#f3ffff"} />
                                    :
                                    <BsDoorOpen size={20} color={"#f3ffff"} />
                                }
                        </Grid>

                        <Grid item xs={4}/>
                        <Grid item xs={4} className={"text-center"}>
                            <p className={"mt-2 mt-md-2 text-capitalize"} style={{color:"#f3ffff", top:5}}>
                            {userToken && userToken.userName}
                            </p>
                        </Grid>
                        <Grid item xs={4} className={"text-center"}>
                           {userToken != null ?
                               <Button className={"font-bold"} style={{color: "white"}} variant={"link"} onClick={logout}>Logout</Button>
                               :
                               <Button className={"font-bold"} style={{color: "white"}} variant={"link"} onClick={() => navigate("/login")}>Login</Button>
                           }
                        </Grid>
                    </Grid>
                </div>
            </Navbar.Collapse>
        </Navbar>
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
        const name = pathVariables[i] === "notificacoes" ? "notificações" : pathVariables[i]
        let currPathVariable = {
            link: pathVariables[i - 1].concat("/",pathVariables[i]),
            displayName: name
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
        <UserAuthContextProvider>
            <NotificationContextProvider>
                <BrowserRouter basename={"/"} key={"router"}>
                    <ErrorBoundary FallbackComponent={GlobalErrorBoundary}>
                        <NavigationBar notificationService={new NotificationService()}/>
                        <DisplayPath/>
                        <CreateRoutes/>
                    </ErrorBoundary>
                </BrowserRouter>
            </NotificationContextProvider>
        </UserAuthContextProvider>
    )
}

export default App;
