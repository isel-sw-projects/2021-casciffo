import {TOKEN_KEY} from "../../common/Constants";
import {UserToken} from "../../common/Types";
import {useParams} from "react-router-dom";
import {ValidationCommentDTO, ValidityComment} from "../../model/proposal/finance/ValidationModels";
import React, {useEffect, useMemo, useState} from "react";
import {Button, CloseButton, Form} from "react-bootstrap";

type ValidationCommentProps = {
    displayForm: boolean,
    onClose: () => void,
    isValidated: boolean,
    onSubmitComment: (comment: ValidationCommentDTO) => void,
    type: string
}

export function ValidationComment(props: ValidationCommentProps) {
    const userToken = useMemo( () => JSON.parse(localStorage.getItem(TOKEN_KEY) || "") as UserToken, [])
    const {proposalId} = useParams()

    const newComment = (): ValidationCommentDTO => ({
        validation: {
            validated: false,
            validationType: props.type
        },
        newValidation: false,
        comment: {
            proposalId: proposalId,
            content: "",
            authorId: userToken.userId,
            commentType: props.type,
            author: {
                userId: userToken.userId,
                name: userToken.userName
            }
        }
    })

    const [comment, setComment] = useState<ValidationCommentDTO>(newComment())
    const [isValidated, setIsValidated] = useState<boolean>()
    const [displayForm, setDisplayForm] = useState(false)

    useEffect(() => {
        setDisplayForm(props.displayForm)
    }, [props.displayForm])

    useEffect(() => {
        setIsValidated(props.isValidated)
    }, [props.isValidated])

    const updateComment = (e: any) => {
        const key = e.target.name as keyof ValidationCommentDTO
        let value: unknown;

        if (e.target.name === "validated")
            value = e.target.checked
        else
            value = e.target.value

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

    const submitComment = () => {
        if(comment.validation?.validated && !isValidated) {
            comment.newValidation = true
        }
        props.onSubmitComment(comment)
        setComment(newComment())
    }

    return (
        (displayForm &&
        <Form className={"justify-content-evenly"}>
        <fieldset className={"border p-3"}>
            <legend className={"float-none w-auto p-2 flex-column"}>
                Comentário
                {<CloseButton className={"float-end"} onClick={props.onClose}/>}
            </legend>

            <Form.Group className={"mb-2"}>
                <Form.Check
                    type={"checkbox"}
                    name={"validated"}
                    checked={comment.validation!.validated}
                    onChange={updateValid}
                    label={"Validado"}
                />
            </Form.Group>
            <Form.Group className={"mb-2"}>
                <Form.Check
                    type={"checkbox"}
                    name={"newValidation"}
                    checked={comment.newValidation}
                    onChange={updateComment}
                    label={"Revalidar?"}
                    style={{display: isValidated && comment.validation!.validated ? "inherit" : "none"}}
                />
            </Form.Group>

            <Form.Group className={"mb-2"}>
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
            <Button onClick={submitComment}>Submeter</Button>
        </fieldset>
    </Form>) || <span/>
    );
}