import React, {useState} from 'react';
import {Button, Container, Form, FormControl, Navbar, Pagination, Table} from "react-bootstrap";
import TracksModel from "../../model/TracksModel";

type SearchProps = {
    model: TracksModel
}

function SearchComponent(props: SearchProps) {
    const model = props.model
    //for now
    const limit = 20
    const maxPage = Math.floor(model.totalTracks/limit)
    const [hasDataBeenFetched, setDataFetched] = useState<boolean>(false)
    const [searchQuery, setQuery] = useState<string>("")
    const [pagePointer, setPagePointer] = useState({currPage: 1, leftMostPage: 1})

    function fetchTopTracks(p: number = 1) {
        setDataFetched(false)
        console.log("#fetchTopTracks: currPage=" + p)
        model.getTopTracks({elementsLimit: limit, pageNum: p, searchQuery: searchQuery})
            .then(() => setDataFetched(true))
    }

    function setNewPage(p: number) {
        return () => {
            let lmp = pagePointer.leftMostPage
            if(p === maxPage) lmp = p - 5
            else if(p > pagePointer.leftMostPage + 3 ) lmp = p - 3
            else if(lmp !== 1 && p === lmp) --lmp
            let newPagePointer = {currPage: p, leftMostPage: lmp}
            setPagePointer(newPagePointer)
            fetchTopTracks(p)
        }
    }

    function createPageIterations(){
        const items = []
        items.push(<Pagination.First onClick={setNewPage(1)} disabled={pagePointer.currPage === 1}/>)
        items.push(<Pagination.Prev onClick={setNewPage(pagePointer.currPage-1)} disabled={pagePointer.currPage === 1}/>)
        for(let i = 0; i < 5; i++) {
            items.push(
                <Pagination.Item key={`pageItem${i}`}
                                 active={pagePointer.currPage === (pagePointer.leftMostPage+i)}
                                 onClick={setNewPage(pagePointer.leftMostPage+i)}>
                {pagePointer.leftMostPage+i}
                </Pagination.Item>
            )
        }
        if(pagePointer.currPage <= maxPage-5) items.push(<Pagination.Ellipsis/>)
        items.push(<Pagination.Item onClick={setNewPage(maxPage)} active={pagePointer.currPage === maxPage}>{maxPage}</Pagination.Item>)
        items.push(<Pagination.Next onClick={setNewPage(pagePointer.currPage+1)} disabled={pagePointer.currPage === maxPage}/>)
        items.push(<Pagination.Last onClick={setNewPage(maxPage)} disabled={pagePointer.currPage === maxPage}/>)
        return items
    }

    function showNavBar() {
        return <Container>
            <Navbar bg={'light'} expand={'lg'}>
                <Container fluid>
                    <Navbar.Brand>Demo React App</Navbar.Brand>
                    <Navbar.Toggle aria-controls={'navbarScroll'}/>
                    <Navbar.Collapse id={'navbarScroll'}>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Portugal"
                                className="me-2"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <Button variant="outline-success" onClick={() => fetchTopTracks()}>Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>;
    }

    function showResultTable() {
        return <Table striped bordered hover size={"sm"}>
            <thead>
            <tr id={"headers"}>
                <th>Track</th>
                <th>Listeners</th>
            </tr>
            </thead>
            <tbody>
            {hasDataBeenFetched ?
                <>
                    {props.model.tracks.map(track => (
                        <tr key={track.name}>
                            <td>{track.name}</td>
                            <td>{track.listeners}</td>
                        </tr>
                    ))}
                </>
                :
                <>
                    <tr key={"template"}>
                        <td colSpan={2}>
                            Search for a country name to show its top tracks and respective listener count!
                        </td>
                    </tr>
                </>
            }
            </tbody>
        </Table>;
    }

    return (
        <>
            {showNavBar()}
            <Container>
                {showResultTable()}
                {hasDataBeenFetched ?
                    <>
                        <Pagination key={"page_nums"}>
                            {createPageIterations()}
                        </Pagination>
                    </> : <></>}
            </Container>
        </>
    );
}

export default SearchComponent;