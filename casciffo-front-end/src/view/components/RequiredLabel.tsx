import {CSSProperties} from "react";
import { Form } from "react-bootstrap";
import {RequiredSpan} from "./RequiredSpan";

type Props = {
    label: string
    styles?: CSSProperties
    classNames?: string
}

export function RequiredLabel(props: Props) {
    return <Form.Label className={props.classNames || "font-bold"} style={props.styles}>
        <RequiredSpan text={props.label}/>
    </Form.Label>
}