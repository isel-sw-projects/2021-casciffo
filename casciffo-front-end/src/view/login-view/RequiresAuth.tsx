import React, {useEffect} from "react";
import {useState} from "react";
import {useToken} from "../../custom_hooks/useToken";
import {Login} from "./Login";
import {UserService} from "../../services/UserService";
import {Navigate} from "react-router-dom";

export default function RequiresAuth(childs: any) {
    const [token, setToken] = useToken()

    if(token == null) {
        return <Navigate to={"/login-view"} replace={true}/>
    }


    return <React.Fragment>
        {childs}
    </React.Fragment>
}