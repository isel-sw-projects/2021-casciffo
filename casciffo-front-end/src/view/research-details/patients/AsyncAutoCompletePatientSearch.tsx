import React, {useCallback, useState} from "react";
import {AsyncTypeahead, Highlighter} from "react-bootstrap-typeahead";
import {PatientModel} from "../../../model/research/ResearchModel";

type AutoCompletePatientsProps = {
    requestPatients(query: string): Promise<PatientModel[]>
    setPatient(patient: PatientModel): void
}

const requestCache = new Map<string, PatientModel[]>();
const PER_PAGE = 50;


export function AsyncAutoCompletePatientSearch(props: AutoCompletePatientsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<PatientModel[]>([]);
    const [query, setQuery] = useState("");
    const newPatient = (): PatientModel => ({
        id: "",
        processId: "",
        fullName: "",
        gender: "",
        age: ""
    })
    const [selectedPatient, setSelectedPatient] = useState<PatientModel>(newPatient())
    const resetSelectedPatient = () => setSelectedPatient(newPatient())

    const handleInputChange = (q: string) => {
        setQuery(q);
        const underMinimum = q.length !== 0 && q.length < 3
        // setShowToolTip(underMinimum)
        if(underMinimum) {
            setIsLoading(false)
        }
        resetSelectedPatient()
    };

    // const handlePagination = (e: unknown, shownResults: unknown) => {
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
    // };

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
        setSelectedPatient({
            id: "",
            processId: "",
            fullName: "",
            gender: "",
            age: ""
        })
        props.requestPatients(query)
            .then((patients) => {
                console.log("------------NEW REQUEST MADE-------------")
                console.log(query)
                console.log(patients)
                requestCache.set(query, patients);
                console.log("------------END OF NEW REQUEST-------------")

                setOptions(patients);
                setIsLoading(false);
            });
    }, [props]);

    // Bypass client-side filtering by returning `true`. Results are already
    // filtered by the search endpoint, so no need to do it again.
    const filterBy = () => true;

    function onSelectedPatient(patient: PatientModel) {
        setIsLoading(false)
        // setShowToolTip(false)
        props.setPatient(patient)
        setSelectedPatient(patient)
    }

    // const [showToolTip, setShowToolTip] = useState(false)

    // const toggleToolTip = () => setShowToolTip(!showToolTip)

    return (
        // <OverlayTrigger
        //     key={"search-warning"}
        //     placement={"left"}
        //     delay={150}
        //     show={showToolTip}
        //     overlay={
        //         <Tooltip id={`tooltip-top`} onClick={toggleToolTip}>
        //             <Stack direction={"horizontal"}>
        //                 <div style={{width:"10%"}}>
        //                     <span  className={"float-start"} style={{fontSize: "1rem"}}>⚠️</span>
        //                 </div>
        //                 <div style={{width:"90%"}}>
        //                     <span>Introduza o número do processo do paciente.
        //                         A pesquisa começa após o primerio digito.</span>
        //                 </div>
        //             </Stack>
        //         </Tooltip>
        //     }
        // >
            <AsyncTypeahead
                isInvalid={(selectedPatient.processId === "" && query !== "")}
                isValid={(selectedPatient.processId !== "" && query === selectedPatient.processId && query !== "")}
                inputProps={{required: true}}
                id="async-autocomplete"
                delay={200}
                filterBy={filterBy}
                isLoading={isLoading}
                labelKey="fullName"
                maxResults={PER_PAGE - 1}
                minLength={1}
                ignoreDiacritics={true}
                onInputChange={handleInputChange}
                // onPaginate={handlePagination}
                onSearch={handleSearch}
                options={options}
                placeholder={"Procurar por paciente"}
                paginate
                promptText="Searching"
                searchText="A carregar..."
                renderMenuItemChildren={(option: any) => {
                    return (
                        <div key={option.id} className={"border-bottom"} onClick={() => onSelectedPatient(option)}>
                            <Highlighter search={query}>
                                {option.fullName}
                            </Highlighter>
                            <div>
                                <small>
                                    {option.processId}
                                </small>
                            </div>
                        </div>
                    )}}
                useCache={false}
            />
        // </OverlayTrigger>
    );
}