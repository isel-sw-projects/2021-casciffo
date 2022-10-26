import {FloatingLabel, Form} from "react-bootstrap";
import React from "react";

export function FloatingLabelHelper(
    props: {label: string, name: string, value?: string, required?: boolean, type?: string, onChange?: (e: any) => void, style?: {}}
) {
    return (
        <FloatingLabel className={"font-bold m-2"} label={props.label}>
            <Form.Control
                style={props.style}
                type={props.type ?? "text"}
                value={props.value ?? ""}
                name={props.name}
                placeholder={props.label}
                readOnly={props.onChange == null}
                onChange={props.onChange}
                required={props.required}
            />
        </FloatingLabel>
    )
}