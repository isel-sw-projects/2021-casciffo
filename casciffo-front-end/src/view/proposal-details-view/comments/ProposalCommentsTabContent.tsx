import {Button, Container, FormControl} from "react-bootstrap";
import {ProposalCommentsModel} from "../../../model/proposal/ProposalCommentsModel";
import React, {useEffect, useState} from "react";
import {CommentTypes} from "../../../common/Constants";
import {useUserAuthContext} from "../../context/UserAuthContext";
import {MyTable} from "../../components/MyTable";
import {ColumnDef} from "@tanstack/react-table";

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

    const [comments, setComments] = useState<ProposalCommentsModel[]>([])
    const {userToken} = useUserAuthContext()
    const [state, setState] = useState<MyState>({
        addComment: false,
        comment: ""
    })
    useEffect(() => {
        setComments(props.comments.filter(c => c.commentType === props.commentType.id))
    }, [props.commentType.id, props.comments])

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
    

    const columns = React.useMemo<ColumnDef<ProposalCommentsModel>[]>(
        () => [
            {
                accessorFn: row => row.createdDate,
                id: 'created-date',
                header: () => "Data",
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.author,
                id: 'author',
                header: () => "Autor",
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.content,
                id: 'created-date',
                header: () => "Comentário",
                cell: info => info.getValue(),
                footer: props => props.column.id,
            }
        ]
        ,[])

    return (
        <Container>
            <Container className={"mb-5"}>
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

            <div style={{marginTop: "2rem", marginBottom: "2rem"}}>
                <MyTable
                    pagination
                    data={comments}
                    columns={columns}
                    colgroup={[
                        <col span={1} style={{width: "15%"}}/>,
                        <col span={1} style={{width: "15%"}}/>,
                        <col span={1} style={{width: "70%"}}/>]
                    }
                />
            </div>
        </Container>
    )
}