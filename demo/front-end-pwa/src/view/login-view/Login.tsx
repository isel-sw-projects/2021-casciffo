import React, {useCallback, useContext, useState} from "react";
import { UserService } from "../../services/UserService";
import {Button, Container, Form} from "react-bootstrap";
import {Navigate} from "react-router-dom";
import {useUserAuthContext} from "../context/UserAuthContext";
import {useErrorHandler} from "react-error-boundary";

type LoginProps = {
    UserService: UserService
}

export function Login(props: LoginProps) {
    const [state, setState] = useState({
        email: "",
        password: "",
        showPassword: false
    })
    
    const errorHandler = useErrorHandler()
    const [toRedirect, setToRedirect] = useState(false)
    
    const userAuthContext = useUserAuthContext()
    
    const login = useCallback(
        () => {
            props.UserService
                .login({
                    email: state.email,
                    password: state.password
                })
                .then(r => userAuthContext.setUserToken(r))
                .then(_ => setToRedirect(true))
                .catch(errorHandler)
        }, [errorHandler, props.UserService, state.email, state.password, userAuthContext]
    )

    const updateState =
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setState(prevState => ({...prevState, [e.target.name]: e.target.value}))

    return (
        (toRedirect && <Navigate to={"/"} replace={true}/>) ||
        <Container className={"justify-content-evenly flex-column align-content-center mt-5"} style={{width:"400px"}}>
            <Form>
                <Form.Group className={"mb-3"} controlId={"formBasicSwitch"}>
                    <Form.FloatingLabel label={"Email"}>
                        <Form.Control
                            key={"user-email"}
                            type={"email"}
                            name={"email"}
                            onChange={updateState}
                        />
                    </Form.FloatingLabel>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"formBasicSwitch"}>
                    <Form.FloatingLabel label={"Password"}>
                        <Form.Control
                            key={"user-password"}
                            type={state.showPassword ? "text" : "password"}
                            name={"password"}
                            onChange={updateState}
                        />
                    </Form.FloatingLabel>
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        type={"checkbox"}
                        name={"showPassword"}
                        checked={state.showPassword}
                        onChange={(e) => setState(prevState => ({...prevState, [e.target.name]: e.target.checked}))}
                        label={"Mostrar password"}
                    />
                </Form.Group>
                <Button style={{width:"100%"}} type={"button"} onClick={login}>Login</Button>
                {/*TODO meter link para notificar admin*/}
                <legend className={"text-info small"}>Não tem conta? Notifique o administrador</legend>
            </Form>
        </Container>
    )
}