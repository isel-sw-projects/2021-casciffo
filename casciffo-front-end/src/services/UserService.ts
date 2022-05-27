import ApiUrls from "../common/Links";
import UserModel from "../model/user/UserModel";

export class UserService {
    fetchAll() : Promise<Array<UserModel>> {
        return fetch(ApiUrls.usersUrl)
            .then(rsp => rsp.json())
    }

    save(pathology: UserModel): void {
        //TODO
    }
}