import {Button, FormControl, InputGroup} from "react-bootstrap";
import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";

type SearchProps = {
    handleSubmit: (query: string) => void
}

export function SearchComponent(props: SearchProps) {

    const [query, setQuery] = useState<string>("")

    function handleSearch() {
        props.handleSubmit(query)
    }

    function handlePressEnter(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
        (e.key === 'Enter' || e.key === 'NumpadEnter') && handleSearch()
    }

    return (
            <InputGroup>
                <FormControl
                    type="search"
                    placeholder="Pesquisar"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyUp={handlePressEnter}
                />
                <Button variant="outline-success" type={"button"} onClick={handleSearch}>
                    <FaSearch className={"mb-1"}/>
                </Button>
            </InputGroup>
    )
}
