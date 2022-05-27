import React, {useState} from 'react';
import {Container, Pagination, Table} from "react-bootstrap";

import {Page} from "../../common/Types";

type TableProps = {
    getData: () => Array<unknown>, //got stuck being a function to allow generic array
    maxElementsPerPage: number,
    //fixme needs a bit more thought: there can be a deSync between data and isdataready -> Proposal: Move entire logic to parent
    fetchDataAsync: (page: Page) => Promise<void>,
    headers: Array<string>,
    mapDataToRow: (elem: unknown) => JSX.Element
}

export function TableComponent(props: TableProps) {

    const maxPage = Math.floor(props.getData().length/props.maxElementsPerPage)
    const [pagePointer, setPagePointer] = useState({currPage: 1, leftMostPage: 1})

    function setNewPage(p: number) {
        return () => {
            let lmp = pagePointer.leftMostPage
            if(p === maxPage) lmp = p - 5
            else if(p > pagePointer.leftMostPage + 3 ) lmp = p - 3
            else if(lmp !== 1 && p === lmp) --lmp
            let newPagePointer = {currPage: p, leftMostPage: lmp}
            setPagePointer(newPagePointer)
            //FIXME SEARCH QUERY NEEDS TO BE FROM SEARCH COMPONENT
            //proposal: set limit state on parent component
            let page = {elementsLimit: props.maxElementsPerPage, pageNum: p, searchQuery: ""}
            props.fetchDataAsync(page)
        }
    }

    function createPageIterations(){
        const items = []
        items.push(<Pagination.First key={"page-first"} onClick={setNewPage(1)} disabled={pagePointer.currPage === 1}/>)
        items.push(<Pagination.Prev key={"page-prev"} onClick={setNewPage(pagePointer.currPage-1)} disabled={pagePointer.currPage === 1}/>)
        for(let i = 0; i < 5; i++) {
            items.push(
                <Pagination.Item key={`page-item-${i}`}
                                 active={pagePointer.currPage === (pagePointer.leftMostPage+i)}
                                 onClick={setNewPage(pagePointer.leftMostPage+i)}>
                {pagePointer.leftMostPage+i}
                </Pagination.Item>
            )
        }
        if(pagePointer.currPage <= maxPage-5) items.push(<Pagination.Ellipsis/>)
        items.push(<Pagination.Item key={"page-max-item"} onClick={setNewPage(maxPage)} active={pagePointer.currPage === maxPage}>{maxPage}</Pagination.Item>)
        items.push(<Pagination.Next key={"page-next"} onClick={setNewPage(pagePointer.currPage+1)} disabled={pagePointer.currPage === maxPage}/>)
        items.push(<Pagination.Last key={"page-last"} onClick={setNewPage(maxPage)} disabled={pagePointer.currPage === maxPage}/>)
        return items
    }

    function showResultTable() {
        return <Table striped bordered hover size={"sm"}>
            <thead>
            <tr key={"headers"}>
                {props.headers.map((header, i) => <th key={`${header}-${i}`}>{header}</th>)}
            </tr>
            </thead>
            <tbody>

                <>
                    {props.getData().map(props.mapDataToRow)}
                </>

                {/*<>*/}
                {/*    <tr key={"template"}>*/}
                {/*        <td colSpan={props.headers.length}>*/}
                {/*            A carregar...*/}
                {/*        </td>*/}
                {/*    </tr>*/}
                {/*</>*/}

            </tbody>
        </Table>;
    }

    return (
        <>
            <Container>
                {showResultTable()}
                {/*<Pagination key={"page_nums"}>*/}
                {/*    {createPageIterations()}*/}
                {/*</Pagination>*/}
            </Container>
        </>
    );
}

export default TableComponent;