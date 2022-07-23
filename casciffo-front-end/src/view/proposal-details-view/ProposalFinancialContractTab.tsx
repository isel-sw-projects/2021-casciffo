import React, {useEffect, useState} from "react";
import {ProposalFinanceModel} from "../../model/proposal/finance/ProposalFinanceModel";
import {ProposalCommentsModel} from "../../model/proposal/ProposalCommentsModel";
import {Button, Container, Form} from "react-bootstrap";
import {DepartmentTypes} from "../../common/Constants";
import {ColumnDef} from "@tanstack/react-table";
import {ValidationCommentDTO, ValidityComment} from "../../model/proposal/finance/ValidationModels";
import {MyTable} from "../components/MyTable";
import {ValidationComment} from "./ValidationComment";
import {Util} from "../../common/Util";
import {BiCheck, BiCheckboxChecked, BiCheckboxMinus} from "react-icons/bi";
import {useUserAuthContext} from "../context/UserAuthContext";
import {Roles} from "../../model/role/Roles";


type PfcProps = {
    pfc: ProposalFinanceModel,
    comments: ProposalCommentsModel[],
    onSubmitValidationComment: (c: ValidationCommentDTO, validationType:string) => void,
    downloadCf: () => void
    uploadCf: (file: File) => void
}

type ValidationType = {
    id: string,
    name: string
}

export function ProposalFinancialContractTab(props: PfcProps) {

    const [possibleValidationTypes, setPossibleValidationTypes] = useState<ValidationType[]>([])
    const [display, setDisplay] = useState("none")
    const {userToken} = useUserAuthContext()
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const allowedRoles = [Roles.FINANCE.id, Roles.JURIDICAL.id, Roles.SUPERUSER.id].join(",")

        const currentRoles = userToken?.roles
        if(currentRoles == null) return

        const possibleRoles = currentRoles.filter(r => new RegExp(r, 'i').test(allowedRoles)).join(",")

        if(possibleRoles.length !== 0) {
            const types: ValidationType[] = []
            if(new RegExp("SUPERUSER", 'i').test(possibleRoles)) {
                types.push(DepartmentTypes.JURIDICAL)
                types.push(DepartmentTypes.FINANCE)
            }
            else {
                for (let dt in DepartmentTypes) {
                    if (new RegExp(dt, 'i').test(possibleRoles)) {
                        types.push(DepartmentTypes[dt as keyof typeof DepartmentTypes])
                    }
                }
            }
            setPossibleValidationTypes(types)
            setDisplay("inherit")
        }
    }, [userToken?.roles])

    const [depSelected, setDepSelected] = useState(DepartmentTypes.ALL.id)

    const updateDepSelected = (e: React.ChangeEvent<HTMLSelectElement>) => setDepSelected(e.target.value)

    const colgroup = [
        <col key={"first"} span={1} style={{width: "10%"}}/>,
        <col key={"second"} span={1} style={{width: "15%"}}/>,
        <col key={"third"} span={1} style={{width: "55%"}}/>,
        <col key={"fourth"} span={1} style={{width: "10%"}}/>
    ]

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



    useEffect(() => {
        const filterDepComments = (c: ProposalCommentsModel) =>
            c.commentType === DepartmentTypes.FINANCE.id || c.commentType === DepartmentTypes.JURIDICAL.id;

        setComments(
            props.comments
                ?.filter(filterDepComments)
                .map(c => ({
                    comment: {
                        ...c,
                        createdDate: Util.formatDate(c.createdDate!,true)
                    },
                    validated: props.pfc 
                        && props
                            .pfc.validations!
                            .some(v => v.commentRef === c.id && v.validationType === c.commentType && v.validated)
                })) || [])
    }, [props.comments, props.pfc, props.pfc.validations])


    const toggleDisplayForm = () => setDisplayForm(!displayForm)

    const filterCommentsByDepartment = (c: ValidityComment) =>
        depSelected === DepartmentTypes.ALL.id || c.comment!.commentType === depSelected;

    const onSubmitValidation = (c: ValidationCommentDTO) => {
        console.log(c)
        props.onSubmitValidationComment(c, c.validation!.validationType!)
    }

    const handleFileInput = (e: any) => {

    }

    const handleCFSubmission = (e: any) => {
        e.preventDefault()
        console.log(e)
        setIsEditing(false)
    }

    const downloadCf = () => {
        props.downloadCf()
    }

    return (
        <Container className={"flex-column"}>
            <Button
                className={"m-2 m-md-10 p-2 p-md-2"}
                onClick={() => setIsEditing(true)}
                variant={"outline-primary"}
                style={{display: isEditing ? "none" : "inherit"}}
            >
                Submeter novo contrato
            </Button>

            <Button
                className={"m-2 m-md-10 p-2 p-md-2"}
                onClick={() => setIsEditing(false)}
                variant={"outline-danger"}
                style={{display: isEditing ? "inherit" : "none"}}
            >
                Cancelar
            </Button>


            { isEditing ?
                <Form onSubmit={handleCFSubmission} className={"m-2 m-md-10 p-2 p-md-2"}>
                    <Form.Group style={{width: "35%"}}>
                        <Form.Label>Contrato financeiro</Form.Label>
                        <Form.Control
                            key={"financial-contract-file"}
                            type={"file"}
                            name={"file"}
                            onInput={handleFileInput}
                        />
                    </Form.Group>
                    <Button className={"mt-3"} type={"submit"}>Submeter</Button>
                </Form>
                :
                <Button className={"m-2 m-md-10 p-2 p-md-2"} variant={"outline-primary"} onClick={downloadCf}>Descarregar contrato financeiro</Button>
            }

            <div className={"border-top border-2 "} style={{display: display}}>
                <Button className={"m-2 m-md-10 p-2 p-md-2"} onClick={toggleDisplayForm} style={{display: displayForm ? "none" : "inherit"}}>
                    Criar comentário
                </Button>
                <ValidationComment
                    displayForm={displayForm}
                    onClose={() => setDisplayForm(false)}
                    types={possibleValidationTypes}
                    isValidated={props.pfc.validations?.find(v => v.validationType === depSelected)?.validated || false}
                    onSubmitComment={onSubmitValidation}
                />
            </div>


            <Form className={"m-2 m-md-10 p-2 p-md-2"} style={{width:"20%"}}>
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

        </Container>
    )
}