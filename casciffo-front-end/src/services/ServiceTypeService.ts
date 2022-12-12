import ApiUrls from "../common/Links";
import {ServiceTypeModel} from "../model/proposal-constants/ServiceTypeModel";
import {httpDelete, httpGet, httpPost} from "../common/MyUtil";

export class ServiceTypeService {
    fetchAll() : Promise<ServiceTypeModel[]> {
        const url = ApiUrls.serviceTypesUrl
        return httpGet(url)
    }

    save(serviceType: ServiceTypeModel): Promise<ServiceTypeModel> {
        const url = ApiUrls.serviceTypesUrl
        return httpPost(url, serviceType)
    }

    deleteService(id: string): Promise<void> {
        const url= ApiUrls.serviceTypesDetailsUrl(id)
        return httpDelete(url)
    }
}