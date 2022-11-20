import React, {useEffect, useState} from "react"
import {Button, Container, Stack, Table} from "react-bootstrap"
import {ProtocolModel} from "../../../model/proposal/finance/ProtocolModel";
import {MyUtil} from "../../../common/MyUtil";
import {ValidityComment} from "../../../model/proposal/finance/ValidationModels";
import {BiCheckboxChecked, BiCheckboxMinus} from "react-icons/bi";
import {ProposalCommentsModel} from "../../../model/proposal/ProposalCommentsModel";
import {CommentTypes} from "../../../common/Constants";
import {ValidationComment} from "../comments/ValidationComment";

type PPT_Props = {
    saveProtocolComment: (pfcId: string, comment: ValidityComment) => void
    comments: ProposalCommentsModel[]
    setNewComment: (comment: ProposalCommentsModel) =>  void
    protocol?: ProtocolModel
    pfcId?: string
}


export function ProtocolTabContent(props: PPT_Props) {

    const headers = ["Publicado em", "Autor", "Observação", "Validado"]

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

    const sortByDate = (c1: ProposalCommentsModel, c2: ProposalCommentsModel) => MyUtil.cmp(c2.createdDate, c1.createdDate)

    function mapRowElements() {
        // if(!displayData) return (<tr><td colSpan={4}>A carregar comentários...</td></tr>)
        if(comments.length === 0) return (<tr><td colSpan={4}>Sem comentários</td></tr>)
        return comments
            .sort(sortByDate)
            .map(c => {
            return (
                <tr key={c.id}>
                    <td>{MyUtil.formatDate(c.createdDate!, true)}</td>
                    <td>{c.author?.name}</td>
                    <td>{c.content}</td>
                    <td className={"text-center"}>{(protocol?.commentRef === c.id) ?
                        <BiCheckboxChecked style={{color: "green"}} size={40}/>
                        : <BiCheckboxMinus style={{color: "grey"}} size={40}/>}</td>
                </tr>
            )
        })
    }
    const submitForm = (c: ValidityComment) => {
        props.saveProtocolComment(props.pfcId!, c)
        setDisplayForm(false)
    }

    const showCommentForm = () => setDisplayForm(true)

    return (
        <React.Fragment>
            <label className={"font-bold"}>Entidades de competência de avaliação</label>

            <Container>
                <Stack direction={"horizontal"} gap={4}>
                    <h5>CEIC</h5>
                    <span className={"font-bold"}>
                        {protocol?.validatedDate == null ? "Ainda não validado"
                            : <>
                                {`Validado a ${MyUtil.formatDate(protocol.validatedDate)}`}
                            <BiCheckboxChecked style={{color: "green", position: "relative", top: -5}} size={40}/>
                            </>
                        }
                    </span>
                </Stack>
            </Container>
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
                            : MyUtil.formatDate(protocol.validatedDate)}
                    </Button>
                </Stack>


            <div className={"justify-content-evenly"}>
                <Button onClick={showCommentForm} style={{display: displayForm ? "none" : "inherit"}}>
                    Criar comentário
                </Button>

                <ValidationComment
                    displayForm={displayForm}
                    onClose={() => setDisplayForm(false)}
                    types={[CommentTypes.PROTOCOL]}
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
