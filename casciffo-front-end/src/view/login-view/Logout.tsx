import React, {useState} from "react";
import {Button, Container} from "react-bootstrap";
import {Navigate} from "react-router-dom";


export function Logout() {

    const [toRedirect, setToRedirect] = useState(false)



    return (
        (toRedirect && <Navigate to={"/login"} replace={true}/>) ||
        <Container className={"justify-content-evenly flex-column align-content-center mt-5"} style={{width:"400px"}}>
            <h3>Sessão terminada!</h3>
            <br/>
            <br/>
            <br/>
            <Button className={"align-center"} onClick={() => setToRedirect(true)}>
                Iniciar sessão
            </Button>
        </Container>
    )
}