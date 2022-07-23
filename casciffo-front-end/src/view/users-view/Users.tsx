import {UserService} from "../../services/UserService";
import React, {useEffect, useState} from "react";
import UserModel from "../../model/user/UserModel";
import {Container, Form} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import {ColumnDef} from "@tanstack/react-table";
import {ValidityComment} from "../../model/proposal/finance/ValidationModels";
import {BiCheckboxChecked, BiCheckboxMinus} from "react-icons/bi";

type UsersProps = {
    service: UserService
}


export function Users(props: UsersProps) {
    const [users, setUsers] = useState<UserModel[]>([])
    const [newUser, setNewUser] = useState<UserModel>({email: "", name: ""})

    useEffect(() => {
        props.service
            .fetchAll()
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
                accessorFn: row => row.roles,
                id: 'roles',
                header: () => <span>Permissões</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            }], [])

    return (
        <Container>

            <Form>

            </Form>

            <MyTable
                data={users}
                columns={columns}
            />
        </Container>
    )
}