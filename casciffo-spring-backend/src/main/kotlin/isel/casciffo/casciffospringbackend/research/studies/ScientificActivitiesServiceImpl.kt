package isel.casciffo.casciffospringbackend.research.studies

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ResponseStatusException

@Component
class ScientificActivitiesServiceImpl(
   @Autowired val repository: ScientificActivitiesRepository
): ScientificActivitiesService {
    override suspend fun findAllByResearchId(researchId: Int): Flow<ScientificActivity> =
        repository.findAllByResearchId(researchId).asFlow()

    override suspend fun createScientificActivity(scientificActivity: ScientificActivity): ScientificActivity {
        return repository.save(scientificActivity).awaitSingleOrNull()
            ?: throw ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Coulnd't create scientific activity, value was $scientificActivity"
            )
    }

    override suspend fun updateScientificActivity(scientificActivity: ScientificActivity): ScientificActivity {
        repository.findById(scientificActivity.id!!).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Scientific activity doesn't exist!!!")

        return repository.save(scientificActivity).awaitSingleOrNull()
            ?: throw ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Coulnd't update scientific activity, value was $scientificActivity"
            )
    }
}