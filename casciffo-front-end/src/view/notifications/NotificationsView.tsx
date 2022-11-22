import {NotificationService} from "../../services/NotificationService";
import {Button, Col, Container, Row} from "react-bootstrap";
import {MyTable} from "../components/MyTable";
import React, {useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Link, useParams} from "react-router-dom";
import {NotificationModel} from "../../model/user/NotificationModel";
import {AiOutlineCheckCircle} from "react-icons/ai";
import {ImNotification} from "react-icons/im";
import {NOT_AVAILABLE, NotificationType} from "../../common/Constants";
import {MyHashMap} from "../../common/Types";
import {MyUtil} from "../../common/MyUtil";

type NotificationProps = {
    service: NotificationService
}

type NotificationRow = {
    selected: boolean,
    notification: NotificationModel
}

export function NotificationsView(props: NotificationProps) {

    useEffect(() => {
        document.title = MyUtil.NOTIFICATIONS_TITLE()
    })

    const {userId} = useParams()

    const [isDataReady, setIsDataReady] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<NotificationRow[]>([])
    const [checkedInfo, setCheckedInfo] = useState({
        masterCheck: false,
        selectedRows: 0
    })

    useEffect(() => {
        props.service
            .fetchNotifications(userId!)
            .then(value => setNotifications(value.map(n => ({selected: false, notification: n}))))
            .then(_ => setIsDataReady(true))
    }, [userId, props.service])

    // const navigate = useNavigate()
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
            .then(() => setCheckedInfo({masterCheck: false, selectedRows: 0}))
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
            .then(() => setCheckedInfo({masterCheck: false, selectedRows: 0}))
    }

    const deletedSelected = () => {
        const notificationIdsToDelete = notifications.filter(n => n.selected).map(n => n.notification.id!)
        props.service
            .deleteNotifications(userId!, notificationIdsToDelete)
            .then(() => setNotifications(prevState => {
                return prevState.filter(row => notificationIdsToDelete.every(nId => row.notification.id !== nId))
            }))
            .then(() => setCheckedInfo({masterCheck: false, selectedRows: 0}))
    }


    const columns = React.useMemo<ColumnDef<NotificationRow>[]>(
        () => {
            const selectNotificationRow = (row: NotificationRow) => (e: any) => {
                setCheckedInfo(prevState => {
                    const selected = prevState.selectedRows - Math.pow(-1, e.target.checked)
                    return {
                        selectedRows: selected,
                        masterCheck: selected === notifications.length
                    }
                })
                setNotifications(prevState => prevState.map(n => {
                    if(n.notification.id === row.notification.id) {
                        n.selected = e.target.checked
                    }
                    return n
                }))
            }
            //todo check possible solution with useReducer to remove dependency on notifications.length
            const selectAllNotificationRows = (e: any) => {
                setCheckedInfo({masterCheck: e.target.checked, selectedRows: e.target.checked ? notifications.length : 0})
                setNotifications(prevState => prevState.map(n => {
                    n.selected = e.target.checked
                    return n
                }))
            }
            return [
                {
                    accessorFn: row => <input
                        type={"checkbox"}
                        checked={row.selected}
                        className={"form-check-input"}
                        id={`row-check-${row.notification.id}`}
                        onChange={selectNotificationRow(row)}/>,
                    id: 'checkbox-button',
                    header: () => <input
                        type={"checkbox"}
                        checked={checkedInfo.masterCheck}
                        className={"form-check-input"}
                        id={`master-check`}
                        onChange={selectAllNotificationRows}/>,
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
                    accessorFn: row => <Container className={"text-center"}>
                        {row.notification.viewed
                            ? <span>{"Visto"} <AiOutlineCheckCircle color={"#16DA35"}/></span>
                            : <span>{"Não visto"} <ImNotification color={"#EED505"}/></span>}
                    </Container>,
                    id: 'viewed',
                    header: () => <span>Estado</span>,
                    cell: info => info.getValue(),
                    footer: props => props.column.id,
                },
                {
                    accessorFn: row => {
                        const type = NotificationType[row.notification.notificationType as keyof typeof NotificationType]
                        if (!type || !row.notification.ids) return "Não aplicável."
                        const link = type.buildLink(JSON.parse(row.notification.ids || "{}") as MyHashMap)
                        if (link === NOT_AVAILABLE) return "Não aplicàvel"
                        return <Link to={link}>Ver mais</Link>
                    },
                    id: 'detailsLink',
                    cell: info => info.getValue(),
                    header: () => <span>Detalhes</span>,
                    footer: props => props.column.id,
                }]
        }, [checkedInfo.masterCheck, notifications.length])

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
        <Container className={"display-flex"}>
            <div className={"float-start"}>{`(${checkedInfo.selectedRows}) Notificaç${checkedInfo.selectedRows > 1 ? "ões" : "ão"} selecionada${checkedInfo.selectedRows > 1 ? "s" : ""} `}</div>
            <MyTable data={notifications} columns={columns} loading={!isDataReady} emptyDataPlaceholder={"Sem notificações."}/>
        </Container>
    </React.Fragment>
}