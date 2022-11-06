import * as React from 'react'
import {Error403} from "./Error403";
import {Error401} from "./Error401";
import {Error500} from "./Error500";
import { Error400 } from './Error400';



export function GlobalErrorBoundary(props: {error: any}) {
    console.log("error props: ",props)
    switch (props.error.status) {
        case 400: return <Error400 reason={props.error.message}/>;
        case 401: return <Error401 reason={props.error.message}/>;
        case 403: return <Error403 reason={props.error.message}/>;
        default:
            return <Error500 reason={props.error.message}/>
    }
}

