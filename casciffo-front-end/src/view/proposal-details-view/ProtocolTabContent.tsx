import React, {useCallback, useEffect, useState} from "react"
import {Button, Stack, Table} from "react-bootstrap"
import {useParams} from "react-router-dom";
import {ProtocolAggregateDTO, ProtocolModel} from "../../model/proposal/finance/ProtocolModel";
import {Util} from "../../common/Util";
import {ValidityComment} from "../../model/proposal/finance/ValidationModels";
import {BiCheckboxChecked, BiCheckboxMinus} from "react-icons/bi";
import {ProposalCommentsModel} from "../../model/proposal/ProposalCommentsModel";
import {CommentTypes} from "../../common/Constants";
import {ValidationComment} from "./ValidationComment";

type PPT_Props = {
    saveProtocolComment: (proposalId: string,pfcId: string,comment: ValidityComment) => Promise<ProtocolAggregateDTO>
    comments: ProposalCommentsModel[]
    setNewComment: (comment: ProposalCommentsModel) =>  void
    protocol?: ProtocolModel
    pfcId?: string
}


export function ProtocolTabContent(props: PPT_Props) {

    const headers = ["Publicado em", "Autor", "Observação", "Validado"]
    const {proposalId} = useParams()

    const [protocol, setProtocol] = useState<ProtocolModel>()

    const [comments, setComments] = useState<ProposalCommentsModel[]>([])

    const [displayForm, setDisplayForm] = useState(false)

    useEffect(() => {
        setProtocol(props.protocol)
    }, [props.protocol])

    useEffect(() => {
        setComments(props.comments)
    }, [props.comments])

    const getBackgroundColor = (validated: boolean) => ({backgroundColor:validated ? "#0BDA51" : '#03C9D7'})

    const sortByDate = (c1: ProposalCommentsModel, c2: ProposalCommentsModel) => Util.cmp(c2.createdDate, c1.createdDate)

    function mapRowElements() {
        // if(!displayData) return (<tr><td colSpan={4}>A carregar comentários...</td></tr>)
        if(comments.length === 0) return (<tr><td colSpan={4}>Sem comentários</td></tr>)
        return comments
            .sort(sortByDate)
            .map(c => {
            return (
                <tr key={c.id}>
                    <td>{Util.formatDate(c.createdDate!, true)}</td>
                    <td>{c.author?.name}</td>
                    <td>{c.content}</td>
                    <td className={"text-center"}>{(protocol?.commentRef === c.id) ?
                        <BiCheckboxChecked style={{color: "green"}} size={40}/>
                        : <BiCheckboxMinus style={{color: "grey"}} size={40}/>}</td>
                </tr>
            )
        })
    }
    
    //TODO clean up ugly code, shouldn't need any promise, just send the entire thing
    // and in back-end return the proposal with modified protocol && comments or just set them in in the proposalDetails
    const saveComment = useCallback((c: ValidityComment) => {
        props.saveProtocolComment(proposalId!, props.pfcId!, c)
            .then(data => {
                setProtocol(data.protocol!)
                return data
            })
            .then(data => {
                props.setNewComment(data.comment!)
            })
            .then(() => alert('Comment created!'))
            .then(() => setDisplayForm(false))
    },[props, proposalId])

    const submitForm = (c: ValidityComment) => {
        saveComment(c)
    }

    const showCommentForm = () => setDisplayForm(true)

    return (
        <React.Fragment>
            <label>Entidades de competência de avaliação</label>

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


            <div className={"justify-content-evenly"}>
                <Button onClick={showCommentForm} style={{display: displayForm ? "none" : "inherit"}}>
                    Criar comentário
                </Button>

                <ValidationComment
                    displayForm={displayForm}
                    onClose={() => setDisplayForm(false)}
                    type={CommentTypes.PROTOCOL.id}
                    isValidated={protocol?.validated || false}
                    onSubmitComment={submitForm}
                />
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
