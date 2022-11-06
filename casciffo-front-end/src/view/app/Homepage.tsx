import React from "react";
import img from "../../assets/images/logo/cropped-lofotipo-HFF-web_logotipo-HFF-cor-1.png"
import {Image} from "react-bootstrap"

export function Homepage() {
    return <React.Fragment>
        <img src={img} alt="Hospital Prof. Doutor Fernando Fonseca, EPE"/>
    </React.Fragment>
}