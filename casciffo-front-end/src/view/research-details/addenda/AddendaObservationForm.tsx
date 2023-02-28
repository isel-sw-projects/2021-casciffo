import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {FormInputHelper} from "../../components/FormInputHelper";


type Props = {
    onSubmit: (obs: string) => void
    onClose: () => void
}

export function AddendaObservationForm(props: Props) {
    const [observation, setObservation] = useState("")

    const reset = () => {
        props.onClose()
        setObservation("")
    }

    const submit = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        props.onSubmit(observation)
        reset()
    }

    const updateState = (e: any) => {
        setObservation(e.target.value)
    }

    return <fieldset className={"border border-2 p-3"}>
        <legend className={"float-none w-auto p-2"}>Nova Observação</legend>
        <Form onSubmit={submit} style={{width:"33%"}}>

            <FormInputHelper
                required
                formControlClassName={""}
                label={"Observação"}
                type={"textarea"}
                onChange={updateState}
                value={observation}
                editing={true}
                />
            <div>
                <Button className={"mt-2 float-start"} type={"submit"}>Submeter</Button>
                <Button className={"mt-2 float-end"} variant={"outline-danger"} onClick={reset}>Cancelar</Button>
            </div>
        </Form>
    </fieldset>
}