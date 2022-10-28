import React from "react";
import {MyUtil} from "../../common/MyUtil";
import {Container} from "react-bootstrap";

type DashboardProps = {

}

export function Dashboard(props: DashboardProps) {
    document.title = MyUtil.DASHBOARD_TITLE
    return <React.Fragment>
        <Container>

        </Container>

    </React.Fragment>;
}