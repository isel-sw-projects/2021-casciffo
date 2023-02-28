import {Col, Form, Row} from "react-bootstrap"
import {RequiredLabel} from "./RequiredLabel";

type HelperProps = {
    label: string
    type?: string
    value?: string | number
    name?: string
    editing?: boolean
    onChange?: (e: any) => void
    style?: {}
    inline?: boolean
    required?: boolean
    formControlClassName?: string
}

export function FormInputHelper(props: HelperProps) {

    return <Col>
        <Form.Group>
            {
                props.inline !== true ?
                    <>
                        {props.required ?
                            <RequiredLabel label={props.label}/>
                            :
                            <Form.Label className={"font-bold m-2"}>
                                {props.label}
                            </Form.Label>
                        }
                        <Form.Control
                            required={props.required ?? false}
                            className={props.formControlClassName ?? "m-2"}
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
                            {props.required ?
                                <RequiredLabel label={props.label}/>
                                :
                                <Form.Label className={"font-bold m-2"}>
                                    {props.label}
                                </Form.Label>
                            }
                        </Col>
                        <Col>
                            <Form.Control
                                required={props.required ?? false}
                                className={props.formControlClassName ?? "m-2"}
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