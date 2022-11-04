package isel.casciffo.casciffospringbackend.statistics

import isel.casciffo.casciffospringbackend.common.ResearchType

data class ProposalStats(
    val totalCount: Int? = null,
    val numberOfConcluded: Int? = null,
    val numberOfSubmitted: Int? = null,
    val researchType: ResearchType? = null,
)