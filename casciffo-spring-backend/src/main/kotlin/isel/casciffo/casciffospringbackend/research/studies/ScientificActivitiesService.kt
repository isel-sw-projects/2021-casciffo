package isel.casciffo.casciffospringbackend.research.studies

import kotlinx.coroutines.flow.Flow

interface ScientificActivitiesService {
    suspend fun findAllByResearchId(researchId: Int) : Flow<ScientificActivity>
    suspend fun createScientificActivity(scientificActivity: ScientificActivity): ScientificActivity
    suspend fun updateScientificActivity(scientificActivity: ScientificActivity): ScientificActivity
}