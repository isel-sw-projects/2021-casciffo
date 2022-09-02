import {GenericError} from "./GenericError";

export function Error401(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Bad request"}
            reason={props.reason || "Nada aqui para ver...!"}
            imgSrc={"../../assets/images/samples/error-404.svg"}
            alt={"Bad Request"}
            requiresAuth
        />
    )
}