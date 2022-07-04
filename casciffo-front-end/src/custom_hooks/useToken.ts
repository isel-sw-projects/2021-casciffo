import {useState} from "react";
import {UserToken} from "../common/Types";
import {TOKEN_KEY} from "../common/Constants";

export function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem(TOKEN_KEY)
        if(tokenString == null) return tokenString
        const userToken = JSON.parse(tokenString)
        return userToken?.token
    };

    const [token, setToken] = useState<string>(getToken())

    const saveToken = (userToken: UserToken) => {
        localStorage.setItem('token', JSON.stringify(userToken))
        setToken(userToken.token);
    };

    return [
        token,
        saveToken
    ] as const
}