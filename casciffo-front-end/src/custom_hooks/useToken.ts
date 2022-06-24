import {useState} from "react";
import {UserToken} from "../common/Types";

export function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token')
        if(tokenString == null) return tokenString
        const userToken = JSON.parse(tokenString)
        return userToken?.token
    };

    const [token, setToken] = useState(getToken())

    const saveToken = (userToken: UserToken) => {
        localStorage.setItem('token', JSON.stringify(userToken))
        setToken(userToken.token);
    };

    return [
        token,
        saveToken
    ] as const
}