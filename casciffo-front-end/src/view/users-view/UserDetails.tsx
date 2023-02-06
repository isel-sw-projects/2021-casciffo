import React, {useEffect, useState} from "react"
import {UserService} from "../../services/UserService";
import {useParams} from "react-router-dom";
import UserModel from "../../model/user/UserModel";
import {useErrorHandler} from "react-error-boundary";
import {Button, Form} from "react-bootstrap";
import {FloatingLabelHelper} from "../components/FloatingLabelHelper";
import {useNotificationContext} from "../context/NotificationContext";
import {Grid} from "@mui/material";

type Props = {
    service: UserService
}

export function UserDetails(props: Props) {

    const {userId} = useParams()
    const [user, setUser] = useState<UserModel>({})
    const [userPrev, setUserPrev] = useState<UserModel>({})
    const [isEdit, setIsEdit] = useState(false)

    const errorHandler = useErrorHandler()
    const {notificationTimerInMinutes, setNotificationTimer} = useNotificationContext()

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

    }

    const cancelChanges = () => {
        setUser(userPrev)
        setIsEdit(false)
    }

    return <React.Fragment>
        <Grid>
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
                            <FloatingLabelHelper
                                required={isEdit}
                                readOnly={!isEdit}
                                label={"Password"}
                                name={"password"}
                                value={user.password}
                                onChange={updateUserData}
                            />
                            <FloatingLabelHelper
                                required={isEdit}
                                readOnly={!isEdit}
                                label={"Email"}
                                name={"email"}
                                value={user.email}
                                onChange={updateUserData}
                            />
                        {isEdit &&
                            <Grid container title={"A title"} columnSpacing={{ xs: 3, sm: 6, md: 9 }}>
                                <Grid item xs={6} sm={3} md={1.5}>
                                    <Button type={"submit"} variant={"outline-primary"}>
                                        Salvar
                                    </Button>
                                </Grid>
                                <Grid item xs={6} sm={3} md={1.5}>
                                    <Button variant={"outline-danger"} onClick={cancelChanges}>
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>
                        }
                    </fieldset>
            </Form>
        </Grid>
    </React.Fragment>
}