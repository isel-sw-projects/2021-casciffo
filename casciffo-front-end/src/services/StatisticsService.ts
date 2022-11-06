import {ProposalModel} from "../model/proposal/ProposalModel";
import {ResearchAggregateModel} from "../model/research/ResearchModel";
import {TimelineEventModel} from "../model/proposal/TimelineEventModel";
import ApiUrls from "../common/Links";
import {httpGet} from "../common/MyUtil";


export class StatisticsService {
    getProposalStats(): Promise<ProposalStats[]> {
        const url = ApiUrls.proposalStatsUrl()
        return httpGet(url)
    }

    getLastFiveUpdateProposal(): Promise<ProposalModel[]> {
        const url = ApiUrls.proposalLatestModifiedUrl()
        return httpGet(url)
    }

    getThisWeeksEvents(t: string = "WEEK"): Promise<TimelineEventModel[]> {
        const url = ApiUrls.nearestEventsUrl(t)
        return httpGet(url)
    }

    getResearchStats(): Promise<ResearchStats[]> {
        const url = ApiUrls.researchStatsUrl()
        return httpGet(url)
    }

    getLastFiveUpdatedResearch(): Promise<ResearchAggregateModel[]> {
        const url = ApiUrls.researchLatestModifiedUrl()
        return httpGet(url)
    }

}


export interface ResearchStats {
    totalCount: number
    numberOfCompleted: number
    numberOfCanceled: number
    numberOfActive: number
    researchType: string
    hasData: boolean
}

export interface ProposalStats {
    totalCount: number
    numberOfConcluded: number
    numberOfSubmitted: number
    researchType: string
    hasData: boolean
}