import ApiUrls from "../common/Links";
import {UserRoleModel} from "../model/role/UserRoleModel";

export class RoleService {
    fetchAll() : Promise<Array<UserRoleModel>> {
        return fetch(ApiUrls.rolesUrl)
            .then(rsp => rsp.json())
    }

    save(role: UserRoleModel): void {
        //TODO
    }
}