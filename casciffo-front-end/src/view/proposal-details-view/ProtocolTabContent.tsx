import React, {useCallback, useEffect, useState} from "react"
import {Button, Form, Stack, Table} from "react-bootstrap"
import {Navigate, useParams} from "react-router-dom";
import {ProtocolAggregateDTO, ProtocolModel} from "../../model/proposal/finance/ProtocolModel";
import {Util} from "../../common/Util";
import {ProtocolCommentsModel} from "../../model/proposal/finance/ProtocolCommentsModel";
import {BiCheckboxChecked, BiCheckboxMinus} from "react-icons/bi";
import {ProposalCommentsModel} from "../../model/proposal/ProposalCommentsModel";
import {CommentTypes, TOKEN_KEY} from "../../common/Constants";
import {UserToken} from "../../common/Types";

type PPT_Props = {
    saveProtocolComment: (proposalId: string,pfcId: string,comment: ProtocolCommentsModel) => Promise<ProtocolAggregateDTO>
    comments?: ProposalCommentsModel[]
    setNewComment: (comment: ProposalCommentsModel) =>  void
    protocol?: ProtocolModel
    pfcId?: string
}

export function ProtocolTabContent(props: PPT_Props) {

    const headers = ["Data", "Autor", "Observação", "Validado"]
    const {proposalId} = useParams()
    const [protocol, setProtocol] = useState<ProtocolModel>()
    const [comments, setComments] = useState<ProposalCommentsModel[] | undefined>()

    const [displayData, setDisplayData] = useState(false)
    const [comment, setComment] = useState<ProtocolCommentsModel>(newComment())
    const [showCommentForm, setShowCommentForm] = useState(false)

    useEffect(() => {
        setProtocol(props.protocol)
        // props.service
        //     .fetchProtocol(proposalId!, props.pfcId!)
        //     .then(setProtocol)
        //     .then(() => setDisplayData(true))
    }, [props.protocol])

    useEffect(() => {
        setComments(props.comments)
    }, [props.comments])

    const getBackgroundColor = (validated: boolean) => ({backgroundColor:validated ? "#0BDA51" : "#98c3fa"})

    const sortByDate = (c1: ProposalCommentsModel, c2: ProposalCommentsModel) => Util.cmp(c1.createdDate, c2.createdDate)

    function mapRowElements() {
        if(!displayData) return (<tr><td colSpan={4}>A carregar comentários...</td></tr>)
        if(props.comments == null || props.comments!.length === 0) return (<tr><td colSpan={4}>Sem comentários</td></tr>)
        return props.comments!
            .sort(sortByDate)
            .map(c => {
            return (
                <tr key={c.id}>
                    <td>{Util.formatDate(c.createdDate!)}</td>
                    <td>{c.author?.name}</td>
                    <td>{c.content}</td>
                    <td className={"text-center"}>{(protocol?.commentRef === c.id) ?
                        <BiCheckboxChecked style={{color: "green"}} size={40}/>
                        : <BiCheckboxMinus style={{color: "grey"}} size={40}/>}</td>
                </tr>
            )
        })
    }

    const updateCommentState =
        (key: keyof ProtocolCommentsModel, value: unknown) =>
            (prevState: ProtocolCommentsModel) => ({...prevState, [key]: value})

    const updateComment = (e: any) => {
        const key = e.target.name as keyof ProtocolCommentsModel
        let value: unknown;

        if(e.target.name === "validated")
             value = e.target.checked
        else
            value = e.target.value

        setComment(prevState => ({
            ...prevState,
            [key]: value
        }))
        console.log(comment)
    }


    const saveComment = useCallback(() => {
        props.saveProtocolComment(proposalId!, props.pfcId!, comment)
            .then(data => {
                setProtocol(data.protocol!)
                return data
            })
            .then(data => {
                props.setNewComment(data.comment!)
            })
            .then(() => alert('Comment created!'))
            .then(() => setShowCommentForm(false))
            .then(() => setComment(newComment()))
    },[comment, newComment, proposalId, props])

    function newComment(): ProtocolCommentsModel {
        const userToken = JSON.parse(localStorage.getItem(TOKEN_KEY)!) as UserToken
        return {
            validated: false,
            newValidation: false,
            comment: {
                proposalId: proposalId,
                content: "",
                authorId: userToken.userId,
                commentType: CommentTypes.PROTOCOL.id,
                author: {
                    userId: userToken.userId,
                    name: userToken.userName
                }
            }
        }
    }

    const submitForm = () => {
        saveComment()
    }


    const updateCommentContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(prevState => ({
            ...prevState,
            comment: {...prevState.comment, content: event.target.value}
        }));
    }

    function commentForm() {
        return (
            <Form className={"justify-content-evenly"}>
                <fieldset className={"border p-3"}>
                    <legend className={"float-none w-auto p-2"}>Observação</legend>
                    <Form.Group>
                        <Form.Check
                            type={"checkbox"}
                            name={"validated"}
                            checked={comment.validated}
                            onChange={updateComment}
                            label={"Validado"}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            type={"checkbox"}
                            name={"newValidation"}
                            checked={comment.newValidation}
                            onChange={updateComment}
                            label={"Revalidar?"}
                            style={{display: protocol?.validated && comment.validated ? "inherit" : "none"}}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Observação</Form.Label>
                        <Form.Control
                            required
                            as={"textarea"}
                            rows={3}
                            name={"content"}
                            value={comment.comment?.content}
                            onChange={updateCommentContent}
                        />
                    </Form.Group>
                    <Button onClick={submitForm}>Submeter</Button>
                </fieldset>
            </Form>
        );
    }

    return (
        <React.Fragment>
            <label>Entidades de competência de avaliação</label>
            {displayData ?
                <Stack direction={"horizontal"}>
                    <Button
                        className={"float-start m-3"}
                        variant={"primary"}
                        style={getBackgroundColor(protocol?.validated!)}
                        disabled
                    >
                        CEIC
                        <br/>
                        {protocol?.validatedDate == null ? "---"
                            : Util.formatDate(protocol.validatedDate)}
                    </Button>
                </Stack>
                : <p>A carregar estado do protocolo...</p>
            }

            <div className={"justify-content-evenly"}>
                <Button onClick={() => setShowCommentForm(true)}
                        style={{display: showCommentForm ? "none" : "inherit"}}
                >
                    Criar comentário
                </Button>
                {showCommentForm ? commentForm() : <></>}
            </div>

            <Table striped bordered hover size={"sm mt-5"}>
                <colgroup>
                    <col span={1} style={{width: "10%"}}/>
                    <col span={1} style={{width: "15%"}}/>
                    <col span={1} style={{width: "55%"}}/>
                    <col span={1} style={{width: "10%"}}/>
                </colgroup>
                <thead key={"timeline-history-headers"}>
                <tr>
                    {headers.map((h,i) => <th key={i}>{h}</th>)}
                </tr>
                </thead>

                <tbody>
                    {mapRowElements()}
                </tbody>
            </Table>
        </React.Fragment>
    )
}
