import React, {useState} from "react";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Spinner, Table as RBTable} from "react-bootstrap";
import TablePagination from "@mui/material/TablePagination";
import {MyPagination} from "./MyPagination";

type TableProps = {
    data: any[],
    columns: ColumnDef<any>[],
    colgroup?: JSX.Element[],
    withCheckbox?: boolean
    getCheckedRows?: (data: any[]) => void
    loading?: boolean
    emptyDataPlaceholder?: JSX.Element | string
    pagination?: boolean
}

export function MyTable(props: TableProps) {

    const [sorting, setSorting] = useState<SortingState>([])
    // const [rowSelection, setRowSelection] = React.useState({})

    const [pageNum, setPageNum] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const table = useReactTable({
        data: props.data,
        columns: props.columns,
        state: {
            sorting,
            // rowSelection
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    })

    const startIndex = props.pagination ? pageNum * pageSize : 0
    const endIndex = props.pagination ? startIndex + pageSize : 10

    const headerSize = table.getHeaderGroups()[0].headers.length
    const handlePageChange = (newPage: number) => {
        setPageNum(newPage)
    }

    const handleRowSizeChange = (ps: number) => {
        setPageSize(ps)
    }

    return (
        <React.Fragment>
            {props.pagination &&
                <MyPagination
                    total={props.data.length}
                    currentDisplayed={props.data.length}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    setNewPage={handlePageChange}
                    setNewPageSize={handleRowSizeChange}
                />
            }
            <RBTable striped bordered hover size={"m-2 m-md-10 p-2 p-md-2 sm mt-3 mb-5"} className={"border border-2"}>
                {props.colgroup &&
                    <colgroup>
                        {props.colgroup}
                    </colgroup>
                }
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <>
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                        </>
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {props.loading
                    ? <tr key={"empty"}><td colSpan={headerSize} ><span><Spinner as={"span"} animation={"border"}/> A carregar dados...</span></td></tr>
                    : table
                        .getRowModel()
                        .rows.length === 0
                        ? <tr key={"no-values"}><td colSpan={headerSize}>{props.emptyDataPlaceholder ?? "Sem dados."}</td></tr>
                        : table
                            .getRowModel()
                            .rows.slice(startIndex, endIndex)
                            .map(row => {
                                return (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => {
                                            return (
                                                <td key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })
                }
                </tbody>
            </RBTable>
        </React.Fragment>
    )
}

// function IndeterminateCheckbox(
//     {indeterminate, className = '', ...rest}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>
// ) {
//     const ref = React.useRef<HTMLInputElement>(null!)
//
//     React.useEffect(() => {
//         if (typeof indeterminate === 'boolean') {
//             ref.current.indeterminate = !rest.checked && indeterminate
//         }
//     }, [ref, indeterminate, rest.checked])
//
//     return (
//         <input
//             type="checkbox"
//             ref={ref}
//             className={className + ' cursor-pointer'}
//             {...rest}
//         />
//     )
// }