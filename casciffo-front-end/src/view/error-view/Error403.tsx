import {GenericError} from "./GenericError";
import img from "../../assets/images/samples/error-403.png"

export function Error403(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Forbidden"}
            reason={"Não tens permissões suficientes para aceder a este recurso/efetuar esta operação."}
            imgSrc={img}
            alt={"Forbidden"}
            requiresAuth
        />
    )
}