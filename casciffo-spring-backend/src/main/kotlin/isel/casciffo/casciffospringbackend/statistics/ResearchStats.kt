package isel.casciffo.casciffospringbackend.statistics

import isel.casciffo.casciffospringbackend.common.ResearchType

data class ResearchStats(
    val totalCount: Int? = null,
    val numberOfCompleted: Int? = null,
    val numberOfCanceled: Int? = null,
    val numberOfActive: Int? = null,
    val researchType: ResearchType? = null,
)
