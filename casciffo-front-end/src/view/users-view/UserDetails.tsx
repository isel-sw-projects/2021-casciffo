import React, {useEffect, useState} from "react"
import {UserService} from "../../services/UserService";
import {useParams} from "react-router-dom";
import UserModel from "../../model/user/UserModel";
import {useErrorHandler} from "react-error-boundary";

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

    return <React.Fragment>

    </React.Fragment>
}