import ApiUrls from "../common/Links";
import UserModel from "../model/user/UserModel";
import userModel from "../model/user/UserModel";
import {UserToken} from "../common/Types";

export class UserService {
    fetchAll() : Promise<Array<UserModel>> {
        return fetch(ApiUrls.usersUrl)
            .then(rsp => rsp.json())
    }

    login(userModel: userModel) : Promise<Array<UserToken>> {
        return 
    }

    register(userModel: UserModel): void {
        //TODO
    }
}