import {GenericError} from "./GenericError";

export function Error403(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Forbidden"}
            reason={props.reason ?? "Não tens permissões suficientes para aceder a este recurso."}
            imgSrc={"../../assets/images/samples/error-403.svg"}
            alt={"Forbidden"}
            requiresAuth
        />
    )
}