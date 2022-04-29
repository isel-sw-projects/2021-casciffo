import {UserRoleModel} from "../role/UserRoleModel";

export interface StateModel {
    id?: number,
    name: string,
    owner: UserRoleModel
}