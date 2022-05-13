import React, { useCallback, useState } from 'react';
import {AsyncTypeahead, Highlighter} from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import {Stack} from "react-bootstrap";
import UserModel from "../../model/user/UserModel";

type UserInfo = {
    id: string,
    name: string,
    email: string
}

type AutoCompleteProps = {
    requestUsers(query: string): Promise<UserModel[]>
    setInvestigator(investigator: UserInfo): void
}


const requestCache = new Map<string, UserInfo[]>();
const PER_PAGE = 50;

//FIXME POSSIBLE BUG WITH AUTOCOMPLETE WHEN USER DOESNT CLICK THE COMPLETED NAME
export function AsyncAutoCompleteSearch(props: AutoCompleteProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<UserInfo[]>([]);
    const [query, setQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserInfo>({email: "", id: "", name: ""})

    const handleInputChange = (q: string) => {
        setQuery(q);
    };

    const handlePagination = (e: unknown, shownResults: unknown) => {
        // const cachedQuery = requestCache.get(query) || [];
        //
        // // Don't make another request if:
        // // - the cached results exceed the shown results
        // // - we've already fetched all possible results
        // if (
        //     cachedQuery.length > shownResults ||
        //     cachedQuery.length === 9000
        // ) {
        //     return;
        // }
        //
        // setIsLoading(true);
        //
        // const page = cachedQuery.page + 1;
        //
        // props.requestUsers(query, page).then((resp) => {
        //     const options = cachedQuery.options.concat(resp.options);
        //     requestCache.set(query, { ...cachedQuery, options, page });
        //
        //     setIsLoading(false);
        //     setOptions(options);
        // });
    };

    // `handleInputChange` updates state and triggers a re-render, so
    // use `useCallback` to prevent the debounced search handler from
    // being cancelled.
    const handleSearch = useCallback((query : string) => {
        if (requestCache.has(query)) {
            setOptions(requestCache.get(query)!);
            return;
        }

        setIsLoading(true);
        //on each search reset selected user
        setSelectedUser({email: "", id: "", name: ""})
        props.requestUsers(query)
            .then((users) => {
                const usersInfo = users.map(user => ({name: user.name, id: user.userId!, email: user.email}))
                requestCache.set(query, usersInfo);

                setOptions(usersInfo);
                setIsLoading(false);
        });
    }, [props]);

    // Bypass client-side filtering by returning `true`. Results are already
    // filtered by the search endpoint, so no need to do it again.
    const filterBy = () => true;

    function onSelectedUser(user: UserInfo) {
        props.setInvestigator(user)
        setSelectedUser(user)
    }

    return (
        <AsyncTypeahead
            isInvalid={selectedUser.id.length === 0}
            isValid={selectedUser.id.length !== 0}
            inputProps={{required: true}}
            id="async-autocomplete"
            delay={200}
            filterBy={filterBy}
            isLoading={isLoading}
            labelKey="name"
            maxResults={PER_PAGE - 1}
            minLength={3}
            ignoreDiacritics={true}
            onInputChange={handleInputChange}
            onPaginate={handlePagination}
            onSearch={handleSearch}
            options={options}
            paginate
            promptText="Searching"
            searchText="A carregar..."
            renderMenuItemChildren={(option: any) => {
                return (
                    <div key={option.id} className={"border-bottom"} onClick={() => onSelectedUser(option)}>
                        <Highlighter search={query}>
                            {option.name}
                        </Highlighter>
                        <div>
                            <small>
                                {option.email}
                            </small>
                        </div>
                    </div>
                )}}
            useCache={false}
        />
    );
}

