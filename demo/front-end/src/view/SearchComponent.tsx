import React, {useState} from 'react';
import {Button, Container, Form, FormControl, Navbar, Table} from "react-bootstrap";
import TracksModel from "../model/TracksModel";

type SearchProps = {
    model: TracksModel
}

function SearchComponent(props: SearchProps) {
    const model = props.model
    const [searchQuery, setQuery] = useState<string>("")
    const [hasDataBeenFetched, setDataFetched] = useState<boolean>(false)

    function fetchTopTracks() {
        setDataFetched(false)
        alert(searchQuery)
        model.getTopTracks({elementsLimit: 2, pageNum: 1, searchQuery: searchQuery})
            .then(() => setDataFetched(true))
    }

    return (
        <>
            <Container>
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
                                    onChange={e => setQuery( e.target.value )}
                                />
                                <Button variant="outline-success" onClick={fetchTopTracks}>Search</Button>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Container>
            <Container>
               <Table striped bordered hover size={"sm"}>
                   <thead>
                    <tr id={"headers"}>
                        <th>Track</th>
                        <th>Views</th>
                    </tr>
                   </thead>
                   <tbody>
                   {hasDataBeenFetched ?
                       <>
                           {props.model.tracks.map(track => (
                               <tr id={track.name}>
                                   <td>{track.name}</td>
                                   <td>{track.listeners}</td>
                               </tr>
                           ))}
                       </>
                       :
                       <>
                           <tr id={"template"}>
                               <td colSpan={2}>
                                   Search for a country name to show its top tracks and respective listener count!
                               </td>
                           </tr>
                       </>
                   }
                   </tbody>
               </Table>
            </Container>
        </>
    );
}

export default SearchComponent;