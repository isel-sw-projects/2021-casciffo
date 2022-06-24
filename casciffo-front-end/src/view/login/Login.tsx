import React, {useCallback, useState} from "react";
import { UserService } from "../../services/UserService";
import {Button, Container, Form, Stack} from "react-bootstrap";
import {UserToken} from "../../common/Types";
import {FiEye} from "react-icons/fi";

type LoginProps = {
    UserService: UserService,
    setToken: (token: UserToken) => void
}

export function Login(props: LoginProps) {
    const [state, setState] = useState({
        userEmail: "",
        userPassword: "",
        showPassword: false
    })

    const login = useCallback(
        () => {
            props.UserService
        }, [props.UserService, props.setToken]
    )

    const updateState =
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setState(prevState => ({...prevState, [e.target.name]: e.target.value}))

    return (
        <Container className={"justify-content-evenly flex-column align-content-center mt-5"} style={{width:"400px"}}>
            <Form>
                <Form.Group className={"mb-3"} controlId={"formBasicSwitch"}>
                    <Form.FloatingLabel label={"Email"}>
                        <Form.Control
                            key={"user-email"}
                            type={"email"}
                            name={"userEmail"}
                            onChange={updateState}
                        />
                    </Form.FloatingLabel>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"formBasicSwitch"}>
                    <Form.FloatingLabel label={"Password"}>
                        <Form.Control
                            key={"user-password"}
                            type={state.showPassword ? "text" : "password"}
                            name={"userPassword"}
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
                <legend className={"text-info small"}>Não tem conta? Notifique o administrador</legend>
            </Form>
        </Container>
    )
}