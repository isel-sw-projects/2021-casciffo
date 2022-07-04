import React, {useCallback, useState} from "react";
import { UserService } from "../../services/UserService";
import {Button, Container, Form} from "react-bootstrap";
import {Navigate} from "react-router-dom";
import {useToken} from "../../custom_hooks/useToken";

type LoginProps = {
    UserService: UserService
}

export function Login(props: LoginProps) {
    const [state, setState] = useState({
        email: "",
        password: "",
        showPassword: false
    })
    
    const [toRedirect, setToRedirect] = useState(false)
    
    const [_, setToken] = useToken()
    
    const login = useCallback(
        () => {
            props.UserService
                .login({
                    email: state.email,
                    //FIXME THIS NEEDS TO BE LOOKED AT, SEND PASSWORD IN CLEAR?
                    password: state.password
                })
                .then(r => setToken(r))
                .then(_ => setToRedirect(true))
                .catch(reason => console.log(reason))
        }, [props.UserService, setToken, state.email, state.password]
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