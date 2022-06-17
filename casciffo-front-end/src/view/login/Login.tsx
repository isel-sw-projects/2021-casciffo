import React from "react";
import { UserService } from "../../services/UserService";
import {Form} from "react-bootstrap";

type LoginProps = {
    UserService: UserService
}

export function Login(props: LoginProps) {
    return (
        <React.Fragment>
            <Form>
                <Form.Group>
                    <Form.FloatingLabel label={"Email"}/>
                    <Form.Control type={"email"}/>
                    <Form.FloatingLabel label={"Password"}/>
                    <Form.Control type={"password"}/>
                </Form.Group>
            </Form>
        </React.Fragment>
    )
}