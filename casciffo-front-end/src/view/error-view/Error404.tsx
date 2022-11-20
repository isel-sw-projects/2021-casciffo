import {GenericError} from "./GenericError";
import img from "../../assets/images/samples/error-404.png";

export function Error404(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Bad request"}
            reason={props.reason || "Nada para ver aqui...!"}
            imgSrc={img}
            alt={"Bad Request"}
            requiresAuth
        />
    )
}