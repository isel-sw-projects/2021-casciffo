import {KeyValuePair} from "../../common/Types";



type Props = {
    handleSubmit: (query: string) => void
    searchProperties: KeyValuePair<string, string>[]
    onSearchPropertyChange: (property: KeyValuePair<string, string>) => void

}

export function SearchComposite(props: Props) {

}