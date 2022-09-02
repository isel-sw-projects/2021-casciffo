import {Button, Container, Form, FormControl, FormGroup, Table} from "react-bootstrap";
import {ProposalCommentsModel} from "../../model/proposal/ProposalCommentsModel";
import React, {useEffect, useState} from "react";
import {CommentTypes} from "../../common/Constants";
import {MyUtil} from "../../common/MyUtil";
import {useUserAuthContext} from "../context/UserAuthContext";

type PCT_Props = {
    comments: Array<ProposalCommentsModel>,
    addComment: (comment: string, type: string, userName: string, userId: string) => void,
    commentType: { name: string, id: string }
}

type MyState = {
    addComment: boolean,
    comment: string
}

export function ProposalCommentsTabContent(props: PCT_Props) {

    const headers = ["Data", "Autor", "Comentário"]
    const [comments, setComments] = useState<ProposalCommentsModel[]>([])
    const {userToken} = useUserAuthContext()
    const [state, setState] = useState<MyState>({
        addComment: false,
        comment: ""
    })
    useEffect(() => {
        setComments(props.comments)
    }, [props.comments])

    function updateComment(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const key = e.target.name as keyof MyState
        const value = e.target.value
        setState(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    function createComment() {
        props.addComment(state.comment, props.commentType.id, userToken!.userName, userToken!.userId)
        setState({comment: "", addComment:false})
    }

    function createRows() {
        if(comments == null || comments.length === 0)
            return <tr key={"zero-comments"}><td colSpan={3}>Sem resultados</td></tr>

        return comments.filter(c => c.commentType === props.commentType.id).map(mapToRowElement);
    }

    function mapToRowElement(comment: ProposalCommentsModel) {
        return (
            <tr key={comment.id}>
                <td>{MyUtil.formatDate(comment.createdDate!,true)}</td>
                <td>{comment.author?.name}</td>
                <td>{comment.content}</td>
            </tr>
        )
    }

    return (
        <React.Fragment>
            <Container className={"mb-3"}>
                <fieldset className={"border p-3"}>
                    <legend className={"float-none w-auto p-2"}>{props.commentType.name}</legend>
                    <FormControl
                        as={"textarea"}
                        rows={2}
                        name={"comment"}
                        value={state.comment}
                        onChange={updateComment}
                    />
                    <Button className={"w-25 float-end mt-1"} type={"button"} onClick={createComment}>
                        {`Adicionar ${
                            props.commentType === CommentTypes.CONTACT ?
                                CommentTypes.CONTACT.name : CommentTypes.OBSERVATIONS.name
                        }`}
                    </Button>
                </fieldset>
            </Container>
            <br/>
            <br/>
            <br/>
            <br/>
            <Table striped bordered hover size={"sm"}>
                <colgroup>
                    <col span={1} style={{width: "15%"}}/>
                    <col span={1} style={{width: "15%"}}/>
                    <col span={1} style={{width: "70%"}}/>
                </colgroup>
                <thead>
                <tr key={"headers"}>
                    {headers.map((h, i) => <th key={`header-${i}`}>{h}</th>)}
                </tr>
                </thead>
                <tbody>
                    {createRows()}
                </tbody>
            </Table>
        </React.Fragment>
    )
}