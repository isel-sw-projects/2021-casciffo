import React, {useEffect, useState} from "react"
import {UserService} from "../../services/UserService";
import {useParams} from "react-router-dom";
import UserModel from "../../model/user/UserModel";
import {useErrorHandler} from "react-error-boundary";
import {Button, Container, Form} from "react-bootstrap";
import {FloatingLabelHelper} from "../components/FloatingLabelHelper";
import {useNotificationContext} from "../context/NotificationContext";
import {Grid} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import {MyError} from "../error-view/MyError";

type Props = {
    service: UserService
}

export function UserDetails(props: Props) {

    const {userId} = useParams()
    const [user, setUser] = useState<UserModel>({})
    const [userPrev, setUserPrev] = useState<UserModel>({})
    const [isEdit, setIsEdit] = useState(false)

    const errorToast = (err: MyError) => toast.error(err.message)
    const successToast = (msg: string) => toast.success(msg)
    const infoToast = (msg: string) => toast.info(msg)
    const errorHandler = useErrorHandler()

    useEffect(() => {
        props.service
            .fetchUser(userId!)
            .then(value => {
                setUser(value)
                setUserPrev(value)
            })
            .catch(errorHandler)
    }, [props.service, userId, errorHandler])

    const updateUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.name
        const value = e.target.value
        setUser(prevState => ({...prevState, [key]: value}))
    }

    const saveUserDataChanges = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        props.service
            .updateUser(user)
            .then(value => {
                setUser(value)
                setUserPrev(value)
                successToast("Alterações guardadas com sucesso!")
            })
            .catch(err => {
                errorToast(err.msg)
                setUser(userPrev)
            })
    }

    const cancelChanges = () => {
        setUser(userPrev)
        setIsEdit(false)
    }

    const enableEdit = () => {
        setIsEdit(true)
    }

    return <Container>
        <ToastContainer/>
        <Grid container columnSpacing={{sm: 8}}>
            <Grid item sm={3}>
                <Form onSubmit={saveUserDataChanges}>
                        <fieldset className={"border p-3"}>
                            <legend className={"float-none w-auto p-2"}>Dados pessoais</legend>
                                <FloatingLabelHelper
                                    required={isEdit}
                                    readOnly={!isEdit}
                                    label={"Nome"}
                                    name={"name"}
                                    value={user.name}
                                    onChange={updateUserData}
                                />
                            {
                                isEdit &&
                                <FloatingLabelHelper
                                    required
                                    label={"Password"}
                                    name={"password"}
                                    value={user.password}
                                    onChange={updateUserData}
                                />
                            }
                                <FloatingLabelHelper
                                    required={isEdit}
                                    readOnly={!isEdit}
                                    label={"Email"}
                                    name={"email"}
                                    value={user.email}
                                    onChange={updateUserData}
                                />
                            {isEdit ?
                                <div className={"flex ms-2 me-2"}>
                                    <div className={"float-end"}>
                                        <Button type={"submit"} variant={"outline-primary"}>
                                            Salvar
                                        </Button>
                                    </div>
                                    <div className={"float-start"}>
                                        <Button variant={"outline-danger"} onClick={cancelChanges}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                                :
                                <div className={"flex ms-2 me-2"}>
                                    <Button className={"float-end"} onClick={enableEdit}>Editar</Button>
                                </div>
                            }
                        </fieldset>
                </Form>
            </Grid>
        </Grid>
    </Container>
}
