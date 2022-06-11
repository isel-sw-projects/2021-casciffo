import React, {useCallback, useEffect, useState} from "react"
import {Button, Form, FormSelect, Stack, Table} from "react-bootstrap"
import ProposalAggregateService from "../../services/ProposalAggregateService";
import {Navigate, useParams} from "react-router-dom";
import {ProtocolModel} from "../../model/proposal/finance/ProtocolModel";
import {Util} from "../../common/Util";
import {ProtocolCommentsModel} from "../../model/proposal/finance/ProtocolCommentsModel";
import {BiCheckboxChecked, BiCheckboxMinus} from "react-icons/bi";

type PPT_Props = {
    service: ProposalAggregateService,
    pfcId?: string
}

export function ProtocolTabContent(props: PPT_Props) {

    const headers = ["Criado", "Nome\n(Empresa/Papel)","Observação","Validado"]
    const {proposalId} = useParams()
    const [protocol, setProtocol] = useState<ProtocolModel>({
        financialComponentId: 0, id: "", isValidated: false, validatedDate: [],
        comments: []
    })
    const [displayData, setDisplayData] = useState(false)
    const [comment, setComment] = useState<ProtocolCommentsModel>({
        authorName: "",
        orgName: "",
        observation: "",
        validated: false
    })
    const [showCommentForm, setShowCommentForm] = useState(false)

    useEffect(() => {
        props.service
            .fetchProtocol(proposalId!, props.pfcId!)
            .then(setProtocol)
            .then(() => setDisplayData(true))
    }, [props.service, proposalId, props.pfcId])

    const getBackgroundColor = (validated: boolean) => ({backgroundColor:validated ? "#0BDA51" : "#98c3fa"})

    const sortByDate = (c1: ProtocolCommentsModel, c2: ProtocolCommentsModel) => Util.cmp(c1.dateCreated, c2.dateCreated)

    function mapRowElements() {
        if(!displayData) return (<tr><td colSpan={4}>A carregar comentários...</td></tr>)
        if(Util.isNullOrUndefined(protocol.comments) || protocol.comments!.length === 0) return (<tr><td colSpan={4}>Sem comentários</td></tr>)
        return protocol.comments!
            .sort(sortByDate)
            .map(c => {
            return (
                <tr key={c.id}>
                    <td>{Util.formatDate(c.dateCreated!)}</td>
                    <td>{c.authorName + "\n" + c.orgName}</td>
                    <td>{c.observation}</td>
                    <td className={"text-center"}>{c.validated ?
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


    const saveComment = () => {
        return props.service.saveProtocolComment(proposalId!, props.pfcId!, comment)
            .then(comment => setProtocol(prevState => ({...prevState, comments: [...prevState.comments!, comment]})))
    }

    const updateProtocol = useCallback(() => {
        props.service
            .updateProtocol(proposalId!, protocol)
            .then(setProtocol)
    }, [proposalId, props.service, protocol])

    const submitForm = () => {
        protocol.isValidated = comment.validated || false
        saveComment()
            .then(() => {
                if(comment.validated)
                    updateProtocol()
            }).then(() => alert('Comment created!'))
            .then(() => setShowCommentForm(false))
            .then(() => setComment({
                authorName: "",
                orgName: "",
                observation: "",
                validated: false
            }))
    }


    function commentForm() {
        return (
            <Form className={"justify-content-evenly"}>
                <fieldset className={"border p-3"}>
                    <legend className={"float-none w-auto p-2"}>Observação</legend>
                    <Form.Group>
                        <Form.Label>Autor</Form.Label>
                        <Form.Control
                            required
                            type={"text"}
                            name={"authorName"}
                            value={comment.authorName}
                            onChange={updateComment}
                            />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Organização/Papel</Form.Label>
                        <Form.Control
                            required
                            type={"text"}
                            name={"orgName"}
                            value={comment.orgName}
                            onChange={updateComment}
                            />
                    </Form.Group>
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
                        <Form.Label>Observação</Form.Label>
                        <Form.Control
                            required
                            as={"textarea"}
                            rows={3}
                            name={"observation"}
                            value={comment.observation}
                            onChange={updateComment}
                        />
                    </Form.Group>
                    <Button onClick={submitForm}>Criar</Button>
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
                        style={getBackgroundColor(protocol.isValidated!)}
                        disabled
                    >
                        CEIC
                        <br/>
                        {Util.isNullOrUndefined(protocol.validatedDate) ? "---"
                            : Util.formatDate(protocol.validatedDate!)}
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
