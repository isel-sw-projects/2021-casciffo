import React, {useContext, useState} from "react";
import {NOTIFICATION_CHECK_INTERVAL_MINUTES} from "../../common/Constants";

export const NotificationContext = React.createContext({
    notificationCount: 0,
    notificationTimerInMinutes: 10,
    setNotificationCount: (count: number): void => {},
    setNotificationTimer: (timer: number): void => {}
})

export const NotificationContextProvider = (props: { children: any }) => {

    const [notificationCount, setNotificationCount] = useState(0)
    const [notificationTimer, setNotificationTimer] = useState(NOTIFICATION_CHECK_INTERVAL_MINUTES)

    return (
        <NotificationContext.Provider value={{
            notificationTimerInMinutes: notificationTimer,
            setNotificationTimer: setNotificationTimer,
            notificationCount: notificationCount,
            setNotificationCount: setNotificationCount
        }}>
            {props.children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => useContext(NotificationContext);