import {Button, Container, Form, FormControl, Stack} from "react-bootstrap";
import React, {useState} from "react";
import {ProposalModel} from "../../model/proposal/ProposalModel";

type SearchProps = {
    handleSubmit: (query: string) => void
}

export function SearchComponent(props: SearchProps) {

    const [query, setQuery] = useState<string>("")


    return (
            <Form className="d-flex" onSubmit={() => props.handleSubmit(query)}>
                <FormControl
                    type="search"
                    placeholder="Pesquisar"
                    className="me-2"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <Button variant="outline-success">Procurar</Button>
            </Form>
    )
}
