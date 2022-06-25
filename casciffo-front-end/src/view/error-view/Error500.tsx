import {GenericError} from "./GenericError";

export function Error500(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"System Error"}
            reason={props.reason || "The website is currently unavailable. Try again later or contact the developer."}
            imgSrc={"../../assets/images/samples/error-500.svg"}
            alt={"System Error"}
        />
    )
}