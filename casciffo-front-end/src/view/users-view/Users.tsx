import {UserService} from "../../services/UserService";
import React, {useEffect, useState} from "react";
import UserModel from "../../model/user/UserModel";
import {Button, Container, Form, FormControl} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import {ColumnDef} from "@tanstack/react-table";
import {ValidityComment} from "../../model/proposal/finance/ValidationModels";
import {BiCheckboxChecked, BiCheckboxMinus} from "react-icons/bi";
import {AsyncAutoCompleteSearch} from "../proposal-form-view/AsyncAutoCompleteSearch";
import {CommentTypes} from "../../common/Constants";

type UsersProps = {
    service: UserService
}


export function Users(props: UsersProps) {
    const [users, setUsers] = useState<UserModel[]>([])
    const [newUser, setNewUser] = useState<UserModel>({email: "", name: ""})
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        props.service
            .fetchAll()
            .then(value => {
                console.log(value)
                return value
            })
            .then(setUsers)
    }, [props.service])

    const columns = React.useMemo<ColumnDef<UserModel>[]>(
        () => [
            {
                accessorFn: row => row.userId,
                id: 'userId',
                cell: info => info.getValue(),
                header: () => <span>Id</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.name,
                id: 'name',
                cell: info => info.getValue(),
                header: () => <span>Nome</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.email,
                id: 'email',
                cell: info => info.getValue(),
                header: () => <span>Email</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.roles?.map(r => r.roleName).join(", ") || "Sem permissões",
                id: 'roles',
                header: () => <span>Permissões</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            }], [])

    const updateUser = (e: any) => {
        setNewUser(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const createUser = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        props.service.register(newUser)
    }

    return (
        <Container>
            { !showForm && <Button onClick={() => setShowForm(true)}>Criar novo utilizador</Button>}
            { showForm &&
                <Container className={"m-2 m-md-2 p-2 p-md-2 justify-content-evenly float-start"} style={{width:"30%"}}>
                    <Form id={"user-form"} onSubmit={createUser}>
                        <fieldset className={"border border-2 p-3"}>
                            <legend className={"float-none w-auto p-2"}>Criar novo utilizador</legend>
                            <Form.Group className={"m-1 m-md-1"} >
                                <Form.FloatingLabel label={"Nome"} >
                                    <Form.Control
                                        type={"text"}
                                        value={newUser.name}
                                        placeholder={"Nome"}
                                        name={"name"}
                                        onChange={updateUser}
                                    />
                                </Form.FloatingLabel>
                                {/*TODO DROPDOWN WITH ROLES AND JUST SELECT THEM INTO THE USER PERMISSION EZ*/}
                                {/*<Form.FloatingLabel label={"Permissões"}>*/}
                                {/*    <Form.Control*/}
                                {/*        type={"text"}*/}
                                {/*        value={newUser.roles}*/}
                                {/*        name={"roles"}*/}
                                {/*        onChange={(e) => console.log(e.target.value)}*/}
                                {/*    />*/}
                                {/*</Form.FloatingLabel>*/}
                            </Form.Group>

                            <Form.Group className={"m-1 m-md-1"}>
                                <Form.FloatingLabel label={"Email"}>
                                    <Form.Control
                                        type={"text"}
                                        placeholder={"Email"}
                                        value={newUser.name}
                                        name={"name"}
                                        onChange={updateUser}
                                    />
                                </Form.FloatingLabel>
                            </Form.Group>
                            <Form.Group className={"m-1 m-md-1"}>
                                <Form.FloatingLabel label={"Password"}>
                                    <Form.Control
                                        type={"text"}
                                        placeholder={"Password"}
                                        value={newUser.name}
                                        name={"name"}
                                        onChange={updateUser}
                                    />
                                </Form.FloatingLabel>
                            </Form.Group>
                            <Button className={"float-start m-1 m-md-1"} variant={"outline-danger"} onClick={() => setShowForm(false)}>Cancelar</Button>
                            <Button className={"float-end m-1 m-md-1"} variant={"outline-primary"} type={"submit"}>Criar</Button>
                        </fieldset>
                    </Form>
                </Container>
            }


            <MyTable
                data={users}
                columns={columns}
            />
        </Container>
    )
}