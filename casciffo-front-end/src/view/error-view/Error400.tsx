import {GenericError} from "./GenericError";

export function Error400(props: {reason: string | undefined}) {
    return (
        <GenericError
            title={"Bad Request"}
            reason={props.reason ?? "Ocorreu um erro.\nUm pedido mal formado ou ilegal foi efetuado pelo cliente, "}
            imgSrc={"../../assets/images/samples/error-403.svg"}
            alt={"Bad Request"}
        />
    )
}