import {NotificationService} from "../../services/NotificationService";
import {Button, Col, Container, Row} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import React, {useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Link, useNavigate, useParams} from "react-router-dom";
import {NotificationModel} from "../../model/user/NotificationModel";
import {AiOutlineCheckCircle} from "react-icons/ai";
import {ImNotification} from "react-icons/im";

type NotificationProps = {
    service: NotificationService
}

type NotificationRow = {
    selected: boolean,
    notification: NotificationModel
}

export function NotificationsView(props: NotificationProps) {

    const {userId} = useParams()

    const [isDataReady, setIsDataReady] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<NotificationRow[]>([])
    const [selectedCount, setSelectedCount] = useState(0)

    useEffect(() => {
        props.service
            .fetchNotifications(userId!)
            .then(value => setNotifications(value.map(n => ({selected: false, notification: n}))))
    }, [userId, props.service])

    const navigate = useNavigate()

    const markViewed = () => {
        props.service
            .updateNotifications(userId!, notifications.filter(n => n.selected).map(n => {
                n.notification.viewed = true
                return n.notification
            }))
            .then(value => setNotifications(prevState => {
                const notModified = prevState.filter(n => !n.selected)
                return [...notModified, ...value.map(n => ({selected: false, notification: n!}))]
            }))
    }

    const markNotViewed = () => {
        props.service
            .updateNotifications(userId!, notifications.filter(n => n.selected).map(n => {
                n.notification.viewed = false
                return n.notification
            }))
            .then(value => setNotifications(prevState => {
                const notModified = prevState.filter(n => !n.selected)
                return [...notModified, ...value.map(n => ({selected: false, notification: n!}))]
            }))
    }
    
    const deletedSelected = () => {
        const notificationIdsToDelete = notifications.filter(n => n.selected).map(n => n.notification.id!)
        props.service
            .deleteNotifications(userId!, notificationIdsToDelete)
            .then(() => setNotifications(prevState => {
                return prevState.filter(row => notificationIdsToDelete.every(nId => row.notification.id !== nId))
            }))
    }

    const selectNotificationRow = (row: NotificationRow) => (e: any) => {
        setSelectedCount(prevState => prevState - Math.pow(-1, e.target.checked))
        setNotifications(prevState => prevState.map(n => {
            if(n.notification.id === row.notification.id) {
                n.selected = e.target.checked
            }
            return n
        }))
    }

    const columns = React.useMemo<ColumnDef<NotificationRow>[]>(
        () => [
            {
                accessorFn: row => <input
                    type={"checkbox"}
                    checked={row.selected}
                    className={"form-check-input"}
                    id={`row-check-${row.notification.id}`}
                    onChange={selectNotificationRow(row)}/>,
                id: 'delete-button',
                header: () => <span/>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.notification.title,
                id: 'name',
                cell: info => info.getValue(),
                header: () => <span>Título</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.notification.description,
                id: 'description',
                cell: info => info.getValue(),
                header: () => <span>Descrição</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.notification.viewed
                    ? <AiOutlineCheckCircle color={"#16DA35"}/>
                    : <ImNotification color={"#EED505"}/> ,
                id: 'viewed',
                header: () => <span>Estado</span>,
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => <Link to={row.notification.detailsLink!}>Ver mais</Link> ,
                id: 'detailsLink',
                cell: info => info.getValue(),
                header: () => <span/>,
                footer: props => props.column.id,
            }], [])

    return <React.Fragment>
        <Container>
            <h4>Notificações</h4>
            {notifications.length > 0 &&
                <Row>
                    <Col>
                        <Button variant={"link"} onClick={markViewed}>Marcar como lido</Button>
                    </Col>
                    <Col/>
                    <Col>
                        <Button variant={"link"} onClick={markNotViewed}>Marcar como não lido</Button>
                    </Col>
                    <Col/>
                    <Col>
                        <Button variant={"link"} onClick={deletedSelected}>Remover</Button>
                    </Col>
                </Row>
            }
        </Container>
        <Container>
            <MyTable data={notifications} columns={columns} loading={isDataReady} emptyDataPlaceholder={"Sem notificações."}/>
        </Container>
    </React.Fragment>
}