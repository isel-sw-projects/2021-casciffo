import {PathologyService} from "./PathologyService";
import {TherapeuticAreaService} from "./TherapeuticAreaService";
import {ServiceTypeService} from "./ServiceTypeService";
import {ConstantsModel} from "../common/Types";
import ApiUrls from "../common/Links";
import {httpGet} from "../common/MyUtil";
import {PathologyModel} from "../model/proposal-constants/PathologyModel";
import {ServiceTypeModel} from "../model/proposal-constants/ServiceTypeModel";
import {TherapeuticAreaModel} from "../model/proposal-constants/TherapeuticAreaModel";

export class ConstantsService {
    private pathologyService = new PathologyService()
    private therapeuticAreaService = new TherapeuticAreaService()
    private serviceTypeService = new ServiceTypeService()

    fetchConstants(): Promise<ConstantsModel> {
        const url = ApiUrls.constantsUrl
        return httpGet(url)
    }

    getPathologies(): Promise<PathologyModel[]> {
        return this.pathologyService.fetchAll()
    }

    getServiceTypes(): Promise<ServiceTypeModel[]> {
        return this.serviceTypeService.fetchAll()
    }

    getTherapeuticAreas(): Promise<TherapeuticAreaModel[]> {
        return this.therapeuticAreaService.fetchAll()
    }

    savePathology(pathology: PathologyModel): Promise<PathologyModel> {
        return this.pathologyService.save(pathology)
    }

    saveTherapeuticArea(therapeuticArea: TherapeuticAreaModel): Promise<TherapeuticAreaModel> {
        return this.therapeuticAreaService.save(therapeuticArea)
    }

    saveServiceType(serviceType: ServiceTypeModel): Promise<ServiceTypeModel> {
        return this.serviceTypeService.save(serviceType)
    }

    deleteServiceType(id: string): Promise<void> {
        return this.serviceTypeService.deleteService(id)
    }

    deletePathology(id: string): Promise<void> {
        return this.pathologyService.deletePathology(id)
    }

    deleteTherapeuticArea(id: string): Promise<void> {
        return this.therapeuticAreaService.deleteTherapeuticArea(id)
    }
}