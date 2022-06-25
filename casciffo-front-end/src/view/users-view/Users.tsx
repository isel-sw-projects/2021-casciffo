import {UserService} from "../../services/UserService";
import {useState} from "react";
import UserModel from "../../model/user/UserModel";
import {Container, Form} from "react-bootstrap";

type UsersProps = {
    service: UserService
}

type UserInfo = {
    id: string
    name: string,
    email: string,
    roleName: string
}

export function Users(props: UsersProps) {
    const [users, setUsers] = useState<UserInfo[]>([])
    const [newUser, setNewUser] = useState<UserModel>({userEmail: "", userName: ""})

    return (
        <Container>

            <Form>

            </Form>
        </Container>
    )
}