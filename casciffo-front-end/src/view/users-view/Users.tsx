import {UserService} from "../../services/UserService";
import React, {useCallback, useEffect, useState} from "react";
import UserModel from "../../model/user/UserModel";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import {ColumnDef} from "@tanstack/react-table";
import {UserRoleModel} from "../../model/role/UserRoleModel";
import {Roles} from "../../model/role/Roles";
import {RequiredSpan} from "../components/RequiredSpan";
import {MultiSelect} from "react-multi-select-component";
import {toast, ToastContainer} from "react-toastify";
import {MyError} from "../error-view/MyError";
import { Grid } from "@mui/material";
import {Link} from "react-router-dom";
import {SearchComposite} from "../components/SearchComposite";
import {SearchBar} from "../components/SearchBar";

type UsersProps = {
    service: UserService
}

type RoleWithDisplayName = {
    value: string
    label: string
    disabled?: boolean
}

function UserForm(props: { onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void, newUser: UserModel, onChange: (e: any) => void, onClick: () => void }) {
    return <div className={"justify-content-evenly float-start"}>
        <Form id={"user-form"} onSubmit={props.onSubmit}>
            <fieldset className={"border border-2 p-3"}>
                <legend className={"float-none w-auto p-2"}>Criar novo utilizador</legend>
                <Form.Group className={"m-1 m-md-1"}>
                    <Form.FloatingLabel label={<RequiredSpan text={"Nome"}/>}>
                        <Form.Control
                            type={"text"}
                            value={props.newUser.name}
                            placeholder={"Nome"}
                            name={"name"}
                            onChange={props.onChange}
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
                    <Form.FloatingLabel label={<RequiredSpan text={"Email"}/>}>
                        <Form.Control
                            type={"email"}
                            placeholder={"Email"}
                            value={props.newUser.email}
                            name={"email"}
                            onChange={props.onChange}
                        />
                    </Form.FloatingLabel>
                </Form.Group>
                <Button className={"float-start m-1 m-md-1"} variant={"outline-danger"}
                        onClick={props.onClick}>Cancelar</Button>
                <Button className={"float-end m-1 m-md-1"} variant={"outline-primary"} type={"submit"}>Criar</Button>
            </fieldset>
        </Form>
    </div>;
}

export function Users(props: UsersProps) {
    const [users, setUsers] = useState<UserModel[]>([])
    const [newUser, setNewUser] = useState<UserModel>({email: "", name: ""})
    const [showForm, setShowForm] = useState(false)
    const [roles, setRoles] = useState<RoleWithDisplayName[]>([])

    const showErrorToast = (err: MyError) => toast.error(err.message)

    const mapWithDisplayName = useCallback((roles: UserRoleModel[]) => {
        const toRoleWithDisplayName = (role: UserRoleModel): RoleWithDisplayName => ({
            value: role.roleId!,
            label: Roles[role.roleName as keyof typeof Roles].name
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
    
    const onAddRolesToUser = useCallback((roleIds: number[], userId: string) => {
        props.service
            .addRolesToUser(userId, roleIds)
            .then(updatedUser => {
                setUsers(prevState => prevState.map(u => updatedUser.userId === u.userId ? updatedUser : u))
            })
            .catch(showErrorToast)
    }, [props.service])

    const onRemoveUserRoles = useCallback((roleIds: number[], userId: string) => {
        props.service
            .removeUserRoles(userId, roleIds)
            .then(updatedUser => {
                setUsers(prevState => prevState.map(u => updatedUser.userId === u.userId ? updatedUser : u))
            })
            .catch(showErrorToast)
    }, [props.service])

    const createUser = useCallback((newUser: UserModel) => {
        props.service
            .createUser(newUser)
            .then(r => {
                console.log(r)
                setUsers(prevState => ([...prevState, r]))
            })
            .catch(showErrorToast)
    }, [props.service])

    const columns = React.useMemo<ColumnDef<UserModel>[]>(
        () => [
            {
                accessorFn: row => <div>
                    <div className={"flex-column"}>
                        {row.userId}
                    </div>
                    <Link to={`${row.userId}`}>Ver detalhes</Link>
                </div>,
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
                header: () => <div className={"text-center"}>Ações</div>,
                cell: info =>
                    <AddRolesFromTable
                        row={info.getValue() as UserModel}
                        roles={roles}
                        addUserRoles={onAddRolesToUser}
                        removeUserRoles={onRemoveUserRoles}
                    />,
                footer: props => props.column.id,
            }], [onAddRolesToUser, roles, onRemoveUserRoles])

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

    const [query, setQuery] = useState("")

    const handleSearch = (query: string) => {
        setQuery(query)
    }

    const filterUsers = () => {
        const regExp = new RegExp(`${query}.*`, "gi")
        return users.filter(u => regExp.test(u.name!))
    }

    return (
        <Container>
            <ToastContainer/>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={2} md={3}>
                    <div className={"d-grid"}>
                        { !showForm && <Button onClick={() => setShowForm(true)}>Criar novo utilizador</Button>}
                        { showForm &&
                            <UserForm
                                onSubmit={handleOnSubmit}
                                newUser={newUser}
                                onChange={updateUser}
                                onClick={() => setShowForm(false)}/>
                        }
                    </div>
                </Grid>
            </Grid>

            <div className={"mt-5 mb-2"}>
                <Row>
                    <Col>
                        <SearchBar handleSubmit={handleSearch}/>
                    </Col>
                    <Col/>
                    <Col/>
                </Row>
            </div>
            
            <MyTable
                pagination
                data={filterUsers()}
                columns={columns}
            />
        </Container>
    )
}


function AlterUserRoleForm(
    props: {
        onSubmit: (e: any) => void
        options: RoleWithDisplayName[]
        onCloseForm: () => void
    })
{

    const [rolesToAlter, setRolesToAlter] = useState<RoleWithDisplayName[]>([])

    const onSubmit = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        if(rolesToAlter.length === 0) return
        //call api to add roles
        props.onSubmit(rolesToAlter.map(r => parseInt(r.value)))
        setRolesToAlter([])
    }

    return <Form onSubmit={onSubmit}>
        <Form.Group className={"m-2 p-2"}>
            <MultiSelect
                options={props.options}
                value={rolesToAlter}
                overrideStrings={{
                    allItemsAreSelected: "Todos os papéis estão selecionados.",
                    clearSearch: "Limpar pesquisa",
                    clearSelected: "Limpar seleção",
                    noOptions: "Sem opções",
                    search: "Pesquisar",
                    selectAll: "Selecionar tudo",
                    selectAllFiltered: "Selecionar tudo",
                    selectSomeItems: "Selecionar..."
                }}
                onChange={setRolesToAlter}
                labelledBy={"Escolha de papéis"}
            />
        </Form.Group>
        <Button variant={"outline-danger float-start me-3 ms-3"} onClick={props.onCloseForm}>Cancelar</Button>
        <Button variant={"outline-primary float-end ms-3 me-3"} type={"submit"}>Confirmar</Button>
    </Form>;
}

function AddRolesFromTable(
props:
    {
        row: UserModel,
        roles: RoleWithDisplayName[],
        addUserRoles: (roleIds: number[], userId: string) => void
        removeUserRoles: (roleIds: number[], userId: string) => void
    }
) {

    const [toAdd, setToAdd] = useState(false)
    const [toRemove, setToRemove] = useState(false)

    const toggleToAdd = () => setToAdd(!toAdd)
    const toggleToRemove = () => setToRemove(!toRemove)

    const onAddSubmit = (roleIds: number[]) => {
        setToAdd(false)
        //call api to add roles
        props.addUserRoles(roleIds, props.row.userId!)
    }

    const onRemoveSubmit = (roleIds: number[]) => {
        setToRemove(false)
        props.removeUserRoles(roleIds, props.row.userId!)
    }

    return <Container className={"text-center"}>
        {toAdd || toRemove ?
            toAdd ?
                <AlterUserRoleForm
                    onSubmit={onAddSubmit}
                    onCloseForm={toggleToAdd}
                    options={
                    props.roles
                        .filter(r => props.row.roles!.every(ur => r.value !== ur.roleId))}
                />
                :
                <AlterUserRoleForm
                    onSubmit={onRemoveSubmit}
                    onCloseForm={toggleToRemove}
                    options={
                    props.row.roles!
                        .map(ur => ({label: Roles[ur.roleName! as keyof typeof Roles].name, value: ur.roleId!}))}
                />
            :
            <div>
                <Button variant={"outline-primary float-start m-2"} onClick={toggleToAdd}>Adicionar permissões</Button>
                <Button variant={"outline-danger float-end m-2"} onClick={toggleToRemove}>Remover permissões</Button>
            </div>
        }
    </Container>
}
