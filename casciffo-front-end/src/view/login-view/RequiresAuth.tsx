import React from "react";
import {Navigate} from "react-router-dom";
import {useUserAuthContext} from "../context/UserAuthContext";

export default function RequiresAuth(childs: any) {

    const {userToken} = useUserAuthContext()

    if(userToken == null) {
        return <Navigate to={"/login"} replace={true}/>
    }


    return <React.Fragment>
        {childs}
    </React.Fragment>
}