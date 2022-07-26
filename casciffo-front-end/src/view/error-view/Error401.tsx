import {GenericError} from "./GenericError";

export function Error401(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Unauthorized"}
            reason={props.reason ?? "Precisas de uma conta para aceder a este recurso."}
            imgSrc={"../../assets/images/samples/error-403.svg"}
            alt={"Unauthorized"}
            requiresAuth
        />
    )
}