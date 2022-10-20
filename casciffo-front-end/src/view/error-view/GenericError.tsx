import {Link, useNavigate} from "react-router-dom";
import {Button, Stack} from "react-bootstrap";

type ErrorProps = {
    title: string,
    reason: string,
    imgSrc?: string,
    alt?: string,
    requiresAuth?: boolean
}

export function GenericError(props: ErrorProps) {
    if(props.imgSrc == null && props.alt != null) {
        throw new Error("if img is provided, then so must the alt which explains the image.")
    }

    // const navigate = useNavigate()
    // const goBack = () => {
    //     navigate(-1) # changes doesn't cause rerender KEKW
    // }

    return (
        <div id="error">
            <div className="error-page container">
                <div className="col-md-8 col-12 offset-md-2">
                    <div className="text-center">
                        {props.imgSrc && <img className="img-error" src={props.imgSrc} alt={props.alt}/>}
                        <h1 className="error-title">{props.title}</h1>
                        <p className="fs-5 text-gray-600">{props.reason}</p>
                        <Stack direction={"horizontal"} className={"text-center align-contents-center"} gap={3}>
                            <a href={"/"} className="btn btn-lg btn-outline-primary m-3">Ir para Dashboard</a>
                            {/*<a className="btn btn-lg btn-outline-primary m-3" onClick={goBack}>Voltar ao ecrã anterior</a>*/}
                            {props.requiresAuth &&
                                <a href={"/login"} className="btn btn-lg btn-outline-primary m-3">Login</a>
                            }
                        </Stack>
                    </div>
                </div>
            </div>
        </div>
    )
}