import ApiUrls from "../common/Links";
import {ServiceTypeModel} from "../model/proposal-constants/ServiceTypeModel";
import {httpPost} from "../common/MyUtil";

// noinspection JSUnusedGlobalSymbols
export class ServiceTypeService {
    fetchAll() : Promise<Array<ServiceTypeModel>> {
        return fetch(ApiUrls.serviceTypesUrl)
            .then(rsp => rsp.json())
    }

    save(serviceType: ServiceTypeModel): Promise<ServiceTypeModel> {
        const url = ApiUrls.serviceTypesUrl
        return httpPost(url, serviceType)
    }
}