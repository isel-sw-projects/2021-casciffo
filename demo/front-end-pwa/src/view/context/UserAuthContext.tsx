import React, {useContext} from "react";
import {MyUtil} from "../../common/MyUtil";
import {UserToken} from "../../common/Types";
import {useToken} from "../../custom_hooks/useToken";

export const UserAuthContext = React.createContext({
    userToken: MyUtil.getUserToken(),
    setUserToken: (token: UserToken | null): void => {}
})

export const UserAuthContextProvider = (props: { children: any }) => {
    const [token, setToken, clearToken] = useToken()


    return (
        <UserAuthContext.Provider value={{
            userToken: token,
            setUserToken: token => {
                if (token == null) clearToken()
                else setToken(token)
            }
        }}>
            {props.children}
        </UserAuthContext.Provider>
    );
};

export const useUserAuthContext = () => useContext(UserAuthContext);