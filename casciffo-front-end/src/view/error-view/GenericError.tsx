import {Link} from "react-router-dom";

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
    return (
        <div id="error">
            <div className="error-page container">
                <div className="col-md-8 col-12 offset-md-2">
                    <div className="text-center">
                        {props.imgSrc && <img className="img-error" src={require(props.imgSrc)} alt={props.alt}/>}
                        <h1 className="error-title">{props.title}</h1>
                        <p className="fs-5 text-gray-600">{props.reason}</p>
                        <Link to={"/"} replace={true} className="btn btn-lg btn-outline-primary mt-3">Go Home</Link>
                        {props.requiresAuth &&
                            <Link to={"/login"} replace={true} className="btn btn-lg btn-outline-primary mt-3">Login</Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}