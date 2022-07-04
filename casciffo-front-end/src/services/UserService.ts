import ApiUrls from "../common/Links";
import UserModel from "../model/user/UserModel";
import userModel from "../model/user/UserModel";
import {UserToken} from "../common/Types";
import {httpGet, httpPost} from "../common/Util";

export class UserService {
    fetchAll() : Promise<Array<UserModel>> {
        return httpGet(ApiUrls.usersUrl)
    }

    login(userModel: userModel) : Promise<UserToken> {
        return httpPost(ApiUrls.userLoginUrl, userModel)
    }

    register(userModel: UserModel): Promise<UserToken> {
        return httpPost(ApiUrls.userRegisterUrl, userModel)
    }
}