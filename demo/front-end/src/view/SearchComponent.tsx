import React from 'react';
import {Button, Container, Form, FormControl, Navbar} from "react-bootstrap";
import { Page } from '../common/Types';
import TracksModel from "../model/TracksModel";

const model = new TracksModel()

function fetchTopTracks() {
    model.getTopTracks({elementsLimit: 2, pageNum: 1, searchQuery: 'Portugal'})
        .then()
}

function SearchComponent(this: any) {
    return (
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
                            value={this.state.val}
                            onChange={e => this.setState({ val: e.target.value })}
                        />
                        <Button variant="outline-success" onClick={fetchTopTracks}>Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default SearchComponent;