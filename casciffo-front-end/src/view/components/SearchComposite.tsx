import React from "react";
import {SearchBar} from "./SearchBar";
import {Col, Form, Row} from "react-bootstrap";

type Pair = {
    label: string,
    value: string
}

type Props = {
    handleSubmit: (query: string) => void
    searchProperties: Pair[]
    onSearchPropertyChange: (property: string) => void
    includeVisualizeType?: boolean
    visualizeTypes?: Pair[]
    defaultVisualizeType?: string
    onVisualizeTypeChange?: (property: string) => void
}

export function SearchComposite(props: Props) {

    const onPropertySelect = (e: any) => {
        props.onSearchPropertyChange(e.target.value)
    }

    const onVisualizeTypeSelect = (e: any) => {
        props.onVisualizeTypeChange!(e.target.value)
    }

    return <React.Fragment>
        <Row>
            <Col md={8}>
                <Row>
                    <Col md={4}>
                        <Form.Group className={"d-flex align-items-center"}>
                            <Form.Label className={"font-bold me-2"}>Procurar por</Form.Label>
                            <Form.Select
                                required
                                aria-label="Search properties"
                                name={"search-property"}
                                defaultValue={props.searchProperties[0].value}
                                onChange={onPropertySelect}
                                style={{width:"auto"}}
                            >
                                {props.searchProperties
                                    .map(sp => <option key={`option-${sp.value}`} value={sp.value}>{sp.label}</option>)
                                }
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <SearchBar handleSubmit={props.handleSubmit}/>
                    </Col>
                </Row>
            </Col>
            { props.includeVisualizeType && props.visualizeTypes && props.defaultVisualizeType &&
                <Col md={4}>
                    <Form.Group className={"d-flex align-items-center float-end"}>
                        <Form.Label className={"font-bold me-3"}>A visualizar</Form.Label>
                        <Form.Select
                            key={"visualize-property-type-id"}
                            required
                            aria-label="property type selection to visualize"
                            name={"visulization-type"}
                            defaultValue={props.defaultVisualizeType}
                            onChange={onVisualizeTypeSelect}
                            style={{width: "auto"}}
                        >
                            {props.visualizeTypes
                                .map(vt => <option key={`option-${vt.value}`} value={vt.value}>{vt.label}</option>)
                            }
                        </Form.Select>
                    </Form.Group>
                </Col>
            }
        </Row>
    </React.Fragment>
}