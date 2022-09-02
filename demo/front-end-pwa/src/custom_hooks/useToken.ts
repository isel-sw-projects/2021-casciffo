import {useState} from "react";
import {UserToken} from "../common/Types";
import {TOKEN_KEY} from "../common/Constants";

export function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem(TOKEN_KEY)
        if(tokenString == null) return null
        return JSON.parse(tokenString)
    }

    const [token, setToken] = useState<UserToken | null>(getToken())

    const saveToken = (userToken: UserToken) => {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(userToken))
        setToken(userToken);
    }

    const clearToken = () => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
    }

    return [
        token,
        saveToken,
        clearToken
    ] as const
}