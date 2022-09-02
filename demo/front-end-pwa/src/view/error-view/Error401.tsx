import {GenericError} from "./GenericError";
import {useUserAuthContext} from "../context/UserAuthContext";
import {useEffect, useState} from "react";

export function Error401(props: {reason: string | undefined}) {


    const {userToken, setUserToken} = useUserAuthContext()
    const [reason, setReason] = useState("")

    useEffect(() => {
        const reason = props.reason || userToken !== null
            ? "Sessão expirada, por favor inicie a sua sessão de novo."
            : "Precisas de realizar login para aceder a este recurso."
        setReason(reason)
        setUserToken(null)
    }, [props.reason, setUserToken, userToken])
    
    return (
        <GenericError
            title={"Unauthorized"}
            reason={reason}
            imgSrc={"../../assets/images/samples/error-403.svg"}
            alt={"Unauthorized"}
            requiresAuth
        />
    )
}