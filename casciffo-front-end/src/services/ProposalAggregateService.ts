import PathologyService from "./PathologyService";
import {ServiceTypeService} from "./ServiceTypeService";
import {TherapeuticAreaService} from "./TherapeuticAreaService";
import ProposalService from "./ProposalService";
import {Constants} from "../common/Types";
import ApiUrls from "../common/Links";
import {ProposalModel} from "../model/proposal/ProposalModel";
import {UserService} from "./UserService";
import UserModel from "../model/user/UserModel";

export default class ProposalAggregateService {
    proposalService = new ProposalService()
    userService = new UserService()

    fetchInvestigators(name: string) : Promise<UserModel[]> {
        return fetch(ApiUrls.usersByRoleAndNameUrl(name,["UIC", "SUPERUSER"])).then(rsp => rsp.json())
    }

    fetchConstants(): Promise<Constants> {
        return fetch(ApiUrls.constantsUrl).then(rsp => rsp.json())
    }

    saveProposal(proposal: ProposalModel) {
        return this.proposalService.save(proposal).then(rsp => rsp.json())
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