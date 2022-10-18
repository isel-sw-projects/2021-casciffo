import {Col, Form, Row, Stack} from "react-bootstrap"

type HelperProps = {
    label: string
    type?: string
    value?: string | number
    name?: string
    editing?: boolean
    onChange?: (e: any) => void
    style?: {}
    inline?: boolean
}

export function FormInputHelper(props: HelperProps) {

    return <Col>
        <Form.Group>
            {
                props.inline !== true
                    ? <>
                        <Form.Label className={"font-bold m-2"}>
                            {props.label}
                        </Form.Label>

                        <Form.Control
                            className={"m-2"}
                            type={props.type ?? "input"}
                            disabled={!props.editing ?? false}
                            value={props.value ?? ""}
                            name={props.name}
                            onChange={props.onChange}
                            style={props.style}
                        />
                    </>
                    : <>
                    <Row>
                        <Col>
                            <Form.Label className={"font-bold m-2"}>
                                {props.label}
                            </Form.Label>

                        </Col>
                        <Col>
                            <Form.Control
                                className={"m-2"}
                                type={props.type ?? "input"}
                                disabled={!props.editing ?? false}
                                value={props.value ?? ""}
                                name={props.name}
                                onChange={props.onChange}
                                style={props.style}
                            />

                        </Col>
                    </Row>
                    </>
            }

        </Form.Group>
    </Col>
}