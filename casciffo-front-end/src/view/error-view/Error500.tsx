import {GenericError} from "./GenericError";

export function Error500(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Erro no sistema"}
            reason={props.reason || "Ocorreu um erro no sistema!"}
            imgSrc={"../../assets/images/samples/error-500.svg"}
            alt={"Erro no sistema"}
        />
    )
}