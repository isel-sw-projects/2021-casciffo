import ApiUrls from "../common/Links";
import {ServiceTypeModel} from "../model/constants/ServiceTypeModel";

export class ServiceTypeService {
    fetchAll() : Promise<Array<ServiceTypeModel>> {
        return fetch(ApiUrls.serviceTypesUrl)
            .then(rsp => rsp.json())
    }

    save(pathology: ServiceTypeModel): void {
        //TODO
    }
}