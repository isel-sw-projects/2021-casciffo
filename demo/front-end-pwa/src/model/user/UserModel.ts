import {UserRoleModel} from "../role/UserRoleModel";

interface UserModel {
    userId ?: string,
    name?: string,
    email?: string,
    password?: string,
    roles?: UserRoleModel[],
}

export default UserModel