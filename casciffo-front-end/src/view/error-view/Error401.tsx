import {GenericError} from "./GenericError";

export function Error401(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Unauthorized"}
            reason={props.reason || "You are need to login to see this page."}
            imgSrc={"../../assets/images/samples/error-401.svg"}
            alt={"Unauthorized"}
            requiresAuth
        />
    )
}