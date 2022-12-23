import React, {CSSProperties} from "react";

export function RequiredSpan(props: {text: any, classNames?: string, style?: CSSProperties}) {
    return <span style={props.style} className={props.classNames}>{props.text} <span
        style={{color: "red"}}>*</span></span>
}