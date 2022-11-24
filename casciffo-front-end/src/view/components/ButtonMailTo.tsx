import React from "react";
import { Link } from "react-router-dom";

const ButtonMailto = (props: { mailto: string, label: string }) => {
    return (
        <Link
            to='#'
            onClick={(e) => {
                window.location.href = props.mailto;
                e.preventDefault();
            }}
        >
            {props.label}
        </Link>
    );
};

export default ButtonMailto;