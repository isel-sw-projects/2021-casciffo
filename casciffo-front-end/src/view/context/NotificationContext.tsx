import React, {useContext, useState} from "react";
import {NOTIFICATION_CHECK_INTERVAL_MINUTES} from "../../common/Constants";

export const NotificationContext = React.createContext({
    notificationCount: 0,
    setNotificationCount: (count: number): void => {}
})

export const NotificationContextProvider = (props: { children: any }) => {

    const [notificationCount, setNotificationCount] = useState(0)

    return (
        <NotificationContext.Provider value={{
            notificationCount: notificationCount,
            setNotificationCount: setNotificationCount
        }}>
            {props.children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => useContext(NotificationContext);