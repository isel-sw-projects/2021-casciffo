import ApiUrls from "../common/Links";
import UserModel from "../model/user/UserModel";
import userModel from "../model/user/UserModel";
import {UserToken} from "../common/Types";
import {httpDelete, httpGet, httpPost, httpPut} from "../common/MyUtil";
import {UserRoleModel} from "../model/role/UserRoleModel";

export class UserService {
    fetchAll() : Promise<Array<UserModel>> {
        return httpGet(ApiUrls.usersUrl)
    }

    fetchUser(userId: string): Promise<UserModel> {
        const url = ApiUrls.userDetailsUrl(userId)
        return httpGet(url)
    }

    login(userModel: userModel) : Promise<UserToken> {
        return httpPost(ApiUrls.userLoginUrl, userModel)
    }

    register(userModel: UserModel): Promise<UserToken> {
        return httpPost(ApiUrls.userRegisterUrl, userModel)
    }

    fetchUsersByName(name: string): Promise<UserModel[]> {
        const url = ApiUrls.usersByNameUrl(name)
        return httpGet(url)
    }

    fetchUsersLike(name: string, roles: string[]): Promise<UserModel[]> {
        const url = ApiUrls.usersByRoleAndNameUrl(name, roles)
        return httpGet(url)
    }

    fetchRoles(): Promise<UserRoleModel[]> {
        const url = ApiUrls.rolesUrl
        return httpGet(url)
    }

    addRolesToUser(userId: string, roleIds: number[]): Promise<UserModel> {
        const url = ApiUrls.userRolesUrl(userId)
        return httpPut(url, roleIds)
    }

    removeUserRoles(userId: string, roleIds: number[]): Promise<UserModel> {
        const url = ApiUrls.userRolesUrl(userId)
        return httpDelete(url, roleIds)
    }

    createUser(newUser: UserModel): Promise<UserModel> {
        const url = ApiUrls.usersCreateUrl
        return httpPost(url, newUser)
    }

    updateUser(user: UserModel): Promise<UserModel> {
        const url = ApiUrls.userDetailsUrl(user.userId!)
        return httpPut(url, user)
    }
}