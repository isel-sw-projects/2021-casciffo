import React, {useContext} from "react";
import {MyError} from "../error-view/MyError";

export const ToastMsgContext = React.createContext({
    showErrorToastMsg: (err: MyError): void => {console.log("No context provider was caught!!!")},
    showToastMsg: (msg: string, type: "info" | "success"): void => {console.log("No context provider was caught!!!")}
})

export const useToastMsgContext = () => useContext(ToastMsgContext);