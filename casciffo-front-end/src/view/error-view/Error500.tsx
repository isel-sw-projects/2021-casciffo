import {GenericError} from "./GenericError";
import img from "../../assets/images/samples/error-500.png"

export function Error500(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Erro no sistema"}
            reason={props.reason || "Ocorreu um erro no sistema!"}
            imgSrc={img}
            alt={"Erro no sistema"}
        />
    )
}