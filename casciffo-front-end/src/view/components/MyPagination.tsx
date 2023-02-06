import {Form} from "react-bootstrap";
import React from "react";
import {IconButton} from "@mui/material";
import {BsChevronLeft, BsChevronRight} from "react-icons/bs";


type PaginationComponentProps = {
    total: number
    currentDisplayed: number
    pageNum: number
    pageSize: number
    setNewPage: (p: number) => void
    setNewPageSize: (ps: number) => void
}

export function MyPagination(props: PaginationComponentProps) {

    const maxCountPerPage = props.pageSize * (props.pageNum + 1)
    const currMaxElems = props.total < maxCountPerPage ? props.currentDisplayed : maxCountPerPage
    const currCount = props.pageNum * props.pageSize + 1
    const pageSizeSelection = [10,25,50,100]
    const isLastPage = Math.floor(props.total / props.pageSize) === props.pageNum

    const handleRowSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation()
        e.preventDefault()
        props.setNewPageSize(parseInt(e.target.value))
    }

    const prevPage = () => props.setNewPage(props.pageNum - 1)
    const nextPage = () => props.setNewPage(props.pageNum + 1)
    return (
        <div className={"align-items-center flex mt-2 mb-2"}>
            <div className={"d-inline-flex align-items-center float-start"} style={{width: "60%"}}>
                <span className={"me-2"}>
                    A visualizar
                </span>
                <Form.Select
                    style={{width:"10%"}}
                    key={"row-size-selection-id"}
                    required
                    aria-label="page size selection"
                    name={"pageSize"}
                    defaultValue={props.pageSize}
                    onChange={handleRowSizeChange}
                >
                    {pageSizeSelection.map((size) => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </Form.Select>
                <span className={"ms-2"}>
                    linhas de dados.
                </span>
            </div>
            <div className={"flex float-end"}>
                {currCount} – {currMaxElems} de {props.total}

                <IconButton onClick={prevPage} disabled={props.pageNum === 0}>
                    <BsChevronLeft/>
                </IconButton>

                <IconButton onClick={nextPage} disabled={isLastPage}>
                    <BsChevronRight/>
                </IconButton>
            </div>
        </div>
    )
}