import {useParams} from "react-router-dom";
import {ValidationCommentDTO} from "../../../model/proposal/finance/ValidationModels";
import React, {FormEvent, useEffect, useState} from "react";
import {Button, CloseButton, Form} from "react-bootstrap";
import {useUserAuthContext} from "../../context/UserAuthContext";

type ValidationCommentProps = {
    displayForm: boolean,
    onClose: () => void,
    isValidated: boolean,
    onSubmitComment: (comment: ValidationCommentDTO) => void,
    types: Array<{ id: string, name: string }>
}

export function ValidationComment(props: ValidationCommentProps) {
    const {userToken} = useUserAuthContext()
    const {proposalId} = useParams()
    const [types, setTypes] = useState<Array<{ id: string, name: string }>>()

    useEffect(() => {
        setTypes(props.types)
        //if there is only one type of validation available then auto choose it
        if(props.types?.length === 1) {
            setValidationType(props.types[0].id)
        }
    }, [props.types])

    const newComment = (): ValidationCommentDTO => ({
        validation: {
            validated: false,
            validationType: ""
        },
        newValidation: false,
        comment: {
            proposalId: proposalId,
            content: "",
            authorId: userToken!.userId,
            commentType: "",
            author: {
                userId: userToken!.userId,
                name: userToken!.userName
            }
        }
    })

    const [comment, setComment] = useState<ValidationCommentDTO>(newComment())
    const [isValidated, setIsValidated] = useState<boolean>()
    const [displayForm, setDisplayForm] = useState(false)

    const [validationType, setValidationType] = useState("")
    const updateValidationType = (e: React.ChangeEvent<HTMLSelectElement>) => setValidationType(e.target.value)

    useEffect(() => {
        setDisplayForm(props.displayForm)
    }, [props.displayForm])

    useEffect(() => {
        setIsValidated(props.isValidated)
    }, [props.isValidated])

    const updateCommentCheck = (e:any) => {
        const key = e.target.name as keyof ValidationCommentDTO
        const value = e.target.checked

        setComment(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    const updateComment = (e: any) => {
        const key = e.target.name as keyof ValidationCommentDTO
        const value = e.target.value

        setComment(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    const updateValid = (e: any) => {
        setComment(prevState => ({
            ...prevState,
            validation: {...prevState.validation, validated: e.target.checked}
        }))
    }

    const updateCommentContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(prevState => ({
            ...prevState,
            comment: {...prevState.comment, content: event.target.value}
        }));
    }

    const submitComment = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if(comment.validation?.validated && !isValidated) {
            comment.newValidation = true
        }
        comment.comment!.commentType = validationType
        comment.validation!.validationType = validationType
        props.onSubmitComment(comment)
        setComment(newComment())
    }

    return (
        (displayForm &&
        <Form className={"justify-content-evenly m-2"} onSubmit={submitComment}>
        <fieldset className={"border p-3"}>
            <legend className={"float-none w-auto p-2 flex-column"}>
                Comentário
                {<CloseButton className={"float-end"} onClick={props.onClose}/>}
            </legend>

            <Form.Group className={"m-2"} style={{width:"20%"}}>
                <Form.Label>Tipo de validação</Form.Label>
                <Form.Select
                    required
                    key={"department-type"}
                    name={"validationType"}
                    defaultValue={""}
                    onChange={updateValidationType}
                >
                    {types?.length! > 1 && <option key={"default"} value={""} disabled>Tipo de validação</option>}
                    {types && types.map((rt, i) =>
                        <option key={rt.id} value={rt.id}>{rt.name}</option>
                    )}
                </Form.Select>
            </Form.Group>

            <Form.Group className={"m-2"}>
                <Form.Check
                    type={"checkbox"}
                    name={"validated"}
                    checked={comment.validation!.validated}
                    onChange={updateValid}
                    label={"Validado"}
                />
            </Form.Group>
            <Form.Group className={"m-2"}>
                <Form.Check
                    type={"checkbox"}
                    name={"newValidation"}
                    checked={comment.newValidation}
                    onChange={updateCommentCheck}
                    label={"Revalidar?"}
                    style={{display: isValidated && comment.validation!.validated ? "inherit" : "none"}}
                />
            </Form.Group>

            <Form.Group className={"m-2"}>
                <Form.Label>Observação</Form.Label>
                <Form.Control
                    required
                    as={"textarea"}
                    rows={3}
                    name={"content"}
                    value={comment.comment!.content}
                    onChange={updateCommentContent}
                />
            </Form.Group>
            <Button className={"m-2"} type={"submit"}>Submeter</Button>
        </fieldset>
    </Form>) || <span/>
    );
}