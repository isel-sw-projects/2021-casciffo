import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ProposalFinanceModel} from "../../model/proposal/finance/ProposalFinanceModel";
import {ProposalCommentsModel} from "../../model/proposal/ProposalCommentsModel";
import {Button, Container, Dropdown, Form, Stack} from "react-bootstrap";
import {CommentTypes, DepartmentTypes, ResearchTypes, TOKEN_KEY} from "../../common/Constants";
import {ColumnDef, SortingState} from "@tanstack/react-table";
import {ValidationCommentDTO, ValidityComment} from "../../model/proposal/finance/ValidationModels";
import {MyTable} from "../components/MyTable";
import {ValidationComment} from "./ValidationComment";
import {Util} from "../../common/Util";
import {BiCheck, BiCheckboxChecked, BiCheckboxMinus} from "react-icons/bi";

type PfcProps = {
    pfc: ProposalFinanceModel,
    comments: ProposalCommentsModel[],
    onSubmitValidationComment: (c: ValidationCommentDTO) => void
}



export function ProposalFinancialContractTab(props: PfcProps) {

    const [depSelected, setDepSelected] = useState(DepartmentTypes.ALL.id)

    const updateDepSelected = (e: React.ChangeEvent<HTMLSelectElement>) => setDepSelected(e.target.value)

    const colgroup = [
        <col key={"first"} span={1} style={{width: "10%"}}/>,
        <col key={"second"} span={1} style={{width: "15%"}}/>,
        <col key={"third"} span={1} style={{width: "55%"}}/>,
        <col key={"fourth"} span={1} style={{width: "10%"}}/>
    ]
    const allowedRoles = ["FINANCE", "JURIDICAL", "SUPERUSER"]
    const display = Util.getUserToken()?.roles.some(r => allowedRoles.some(s => s === r)) ?
        "inherit" : "none"

    const [displayForm, setDisplayForm] = useState(false)
    const columns = React.useMemo<ColumnDef<ValidityComment>[]>(
        () => [
            {
                accessorFn: row => row.comment!.createdDate,
                id: 'createdDate',
                cell: info => info.getValue(),
                header: () => <span>Submetido</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.comment!.author!.name,
                id: 'author',
                cell: info => info.getValue(),
                header: () => <span>Autor</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.comment!.content,
                id: 'content',
                cell: info => info.getValue(),
                header: () => <span>Observação</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => (row.validated! && <BiCheckboxChecked style={{color: "green"}} size={40}/>) || <BiCheckboxMinus style={{color: "grey"}} size={40}/>,
                id: 'validated',
                header: () => 'Validado',
                cell: info => info.getValue(),
                footer: props => props.column.id,
            }], [])

    const [comments, setComments] = useState<ValidityComment[]>([])
    // const [validation, setValidation] = useState<Va>()


    useEffect(() => {
        const filterDepComments = (c: ProposalCommentsModel) =>
            c.commentType === DepartmentTypes.FINANCE.id || c.commentType === DepartmentTypes.JURIDICAL.id;

        setComments(
            props
                .comments
                ?.filter(filterDepComments)
                .map(c => ({
                comment: {
                    ...c,
                    createdDate: Util.formatDate(c.createdDate!,true)
                },
                validated: props
                    .pfc?.validations!
                    .some(v => v.commentRef === c.id && v.validationType === c.commentType && v.validated)
            })) || [])
    }, [props.comments, props.pfc?.validations])


    const toggleDisplayForm = () => setDisplayForm(!displayForm)

    const filterCommentsByDepartment = (c: ValidityComment) =>
        depSelected === DepartmentTypes.ALL.id || c.comment!.commentType === depSelected;

    return (
        <Container className={"flex-column"}>

            <div className={"justify-content-evenly"} style={{display: display}}>
                <Button className={"m-3"} onClick={toggleDisplayForm} style={{display: displayForm ? "none" : "inherit"}}>
                    Criar comentário
                </Button>
                <ValidationComment
                    displayForm={displayForm}
                    onClose={() => setDisplayForm(false)}
                    type={depSelected}
                    isValidated={props.pfc.validations?.find(v => v.validationType === depSelected)?.validated || false}
                    onSubmitComment={props.onSubmitValidationComment}
                />
            </div>


            <Stack direction={"horizontal"} gap={3}>
                <Form>
                    <Form.Group>
                        <Form.Label>A visualizar</Form.Label>
                        <Form.Select
                            key={"department-type"}
                            name={"depSelected"}
                            defaultValue={DepartmentTypes.ALL.id}
                            onChange={updateDepSelected}
                        >
                            {Object.values(DepartmentTypes).map((rt) => (
                                <option key={rt.id} value={rt.id}>{rt.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>

                <MyTable
                    data={comments.filter(filterCommentsByDepartment)}
                    columns={columns}
                    colgroup={colgroup}
                />
            </Stack>

        </Container>
    )
}