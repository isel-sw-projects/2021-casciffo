import {UserService} from "../../services/UserService";
import React, {useCallback, useEffect, useState} from "react";
import UserModel from "../../model/user/UserModel";
import {Button, Container, Dropdown, Form, FormControl} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import {ColumnDef} from "@tanstack/react-table";
import {UserRoleModel} from "../../model/role/UserRoleModel";
import {Roles} from "../../model/role/Roles";

type UsersProps = {
    service: UserService
}

type RoleWithDisplayName = {
    roleId: string,
    roleName: string,
    roleDisplayName: string
}
//TODO ADD DELETE ROLE FUNCTION
export function Users(props: UsersProps) {
    const [users, setUsers] = useState<UserModel[]>([])
    const [newUser, setNewUser] = useState<UserModel>({email: "", name: ""})
    const [showForm, setShowForm] = useState(false)
    const [roles, setRoles] = useState<RoleWithDisplayName[]>([])

    const mapWithDisplayName = useCallback((roles: UserRoleModel[]) => {
        const toRoleWithDisplayName = (role: UserRoleModel): RoleWithDisplayName => ({
            roleId: role.roleId!,
            roleName: role.roleName!,
            roleDisplayName: Roles[role.roleName as keyof typeof Roles].name
        })
        return roles.map(toRoleWithDisplayName)
    }, [])
    
    useEffect(() => {

        props.service
            .fetchRoles()
            .then(mapWithDisplayName)
            .then(setRoles)
    }, [mapWithDisplayName, props.service])

    useEffect(() => {
        props.service
            .fetchAll()
            .then(setUsers)
    }, [props.service])
    
    const onAddRolesToUser = useCallback((roleId: number, userId: string) => {
        props.service
            .addRolesToUser(userId, [roleId])
            .then(updatedUser => {
                setUsers(prevState => prevState.map(u => updatedUser.userId === u.userId ? updatedUser : u))
            })
    }, [props.service])

    const createUser = useCallback((newUser: UserModel) => {
        props.service
            .createUser(newUser)
            .then(r => {
                setUsers(prevState => ([...prevState, r]))
            })
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
                accessorFn: row => row.roles?.map(r => Roles[r.roleName as keyof typeof Roles].name).join(", ") || "Sem permissões",
                id: 'roles',
                header: () => <span>Permissões</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row,
                id: 'add-button',
                header: () => <span/>,
                cell: info => <AddRolesFromTable row={info.getValue() as UserModel} roles={roles} addRoleToUser={onAddRolesToUser}/>,
                footer: props => props.column.id,
            }], [onAddRolesToUser, roles])

    const updateUser = (e: any) => {
        setNewUser(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleOnSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        createUser(newUser)
    }

    return (
        <Container>
            { !showForm && <Button onClick={() => setShowForm(true)}>Criar novo utilizador</Button>}
            { showForm &&
                <Container className={"m-2 m-md-2 p-2 p-md-2 justify-content-evenly float-start"} style={{width:"30%"}}>
                    <Form id={"user-form"} onSubmit={handleOnSubmit}>
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
                                        type={"email"}
                                        placeholder={"Email"}
                                        value={newUser.email}
                                        name={"email"}
                                        onChange={updateUser}
                                    />
                                </Form.FloatingLabel>
                            </Form.Group>
                            <Form.Group className={"m-1 m-md-1"}>
                                <Form.FloatingLabel label={"Password"}>
                                    <Form.Control
                                        type={"password"}
                                        placeholder={"Password"}
                                        value={newUser.password}
                                        name={"password"}
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

function AddRolesFromTable(props: {row: UserModel, roles: RoleWithDisplayName[], addRoleToUser: (roleId: number, userId: string) => void}) {

    const [toAdd, setToAdd] = useState(false)
    const [roleIdToAdd, setRoleIdToAdd] = useState<number>()

    const toggleToAdd = () => setToAdd(!toAdd)

    const onSubmit = (e: any) => {
        e.preventDefault()
        setToAdd(false)
        //call api to add roles
        props.addRoleToUser(roleIdToAdd!, props.row.userId!)
    }

    const handleRoleSelected = (roleId: string | null) => {
        if(roleId == null) return
        setRoleIdToAdd(parseInt(roleId))
    }

    return <Container className={"text-center"}>
        {toAdd ?
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Dropdown
                        key={"roles-id"}
                        aria-label={"roles dropdown selection"}
                        className={"m-2"}
                        onSelect={handleRoleSelected}
                    >
                        <Dropdown.Toggle variant={"secondary"} id={"dropdown-roles"} className={"text-left"} style={{width:"100%"}}>
                            {roleIdToAdd ? props.roles.find(r => `${r.roleId}` === `${roleIdToAdd}`)!.roleDisplayName : "Papéis"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {props.roles
                                .map((p, idx) => {
                                    const alreadyExists = props.row.roles!.some(r => r.roleId === p.roleId)

                                    return (
                                        <Dropdown.Item key={`role-option-${idx}`}
                                                       eventKey={p.roleId}
                                                       disabled={alreadyExists}
                                        >
                                            <div>
                                                {Roles[p.roleName as keyof typeof Roles].name}
                                                {alreadyExists &&
                                                    <span className={"float-end font-bold text-danger"}>
                                                        <span className={"text-capitalize"}>{props.row.name}</span> já tem este papel.
                                                    </span>}
                                            </div>
                                        </Dropdown.Item>)
                                })}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
                <Button variant={"outline-danger float-start"} onClick={toggleToAdd}>Cancelar</Button>
                <Button variant={"outline-primary float-end"} type={"submit"}>Adicionar</Button>
            </Form>
            :
            <Button variant={"outline-primary"} onClick={toggleToAdd}>Adicionar permissões</Button>
        }
    </Container>
}