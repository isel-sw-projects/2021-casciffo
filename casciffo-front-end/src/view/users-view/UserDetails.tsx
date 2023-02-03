import React, {useEffect, useState} from "react"
import {UserService} from "../../services/UserService";
import {useParams} from "react-router-dom";
import UserModel from "../../model/user/UserModel";
import {useErrorHandler} from "react-error-boundary";
import {Form} from "react-bootstrap";

type Props = {
    service: UserService
}

export function UserDetails(props: Props) {

    const {userId} = useParams()
    const [user, setUser] = useState<UserModel>({})

    const errorHandler = useErrorHandler()

    useEffect(() => {
        props.service
            .fetchUser(userId!)
            .then(setUser)
            .catch(errorHandler)
    }, [props.service, userId, errorHandler])

    const updateUserData = (e: any) => {
        e.preventDefault()
        e.stopPropagation()

    }

    return <React.Fragment>
        <Form onSubmit={updateUserData}>
            
        </Form>
    </React.Fragment>
}