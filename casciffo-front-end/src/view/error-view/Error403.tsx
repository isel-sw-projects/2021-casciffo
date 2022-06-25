import {GenericError} from "./GenericError";

export function Error403(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Forbidden"}
            reason={props.reason || "The page you are looking for doesn't exist!"}
            imgSrc={"../../assets/images/samples/error-403.svg"}
            alt={"Forbidden"}
            requiresAuth
        />
    )
}