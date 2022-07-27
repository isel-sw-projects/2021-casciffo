import {Col, Form } from "react-bootstrap"

type HelperProps = {
    label: string,
    type?: string
    value?: string,
    name?: string,
    editing?: boolean
    onChange?: (e: any) => void,
}

export function FormInputHelper(props: HelperProps) {

    return <Col>
        <Form.Group>
            <Form.Label className={"font-bold m-2"}>
                {props.label}
            </Form.Label>

            <Form.Control
                className={"m-2"}
                type={props.type ?? "input"}
                disabled={!props.editing ?? false}
                value={props.value}
                name={props.name}
                onChange={props.onChange}
            />
        </Form.Group>
    </Col>
}