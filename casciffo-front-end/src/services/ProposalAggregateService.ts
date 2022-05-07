import PathologyService from "./PathologyService";
import {ServiceTypeService} from "./ServiceTypeService";
import {TherapeuticAreaService} from "./TherapeuticAreaService";
import ProposalService from "./ProposalService";
import {Constants} from "../common/Types";
import ApiUrls from "../common/Links";

export default class ProposalAggregateService {
    constructor() {
        const pathologiesService = new PathologyService()
        const serviceTypesService = new ServiceTypeService()
        const therapeuticAreaService = new TherapeuticAreaService()
        const proposalService = new ProposalService()
    }

    fetchConstants(): Promise<Constants> {
        return fetch(ApiUrls.constantsUrl).then(rsp => rsp.json())
    }

    fetchConstantsMock(): Promise<Constants> {
        return new Promise<Constants>(resolve => {
            setTimeout(() =>
                resolve({
                    serviceTypes: [{id: 1, name: "service1"}],
                    pathologies: [{id: 1, name: "service1"}],
                    therapeuticAreas: [{id: 1, name: "Terapia Cardio"}]
                }), 1)
        })
    }
}