package isel.casciffo.casciffospringbackend.research.studies

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.toList
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
    override suspend fun findAllByResearchId(researchId: Int): Flow<ScientificActivity> {
        return repository.findAllByResearchId(researchId).asFlow()
    }

    override suspend fun createScientificActivity(scientificActivity: ScientificActivity): ScientificActivity {
        return repository.save(scientificActivity).awaitSingleOrNull()
            ?: throw ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Não foi possível criar a atividade científica. Valor recebido: [$scientificActivity]"
            )
    }

    override suspend fun updateScientificActivity(scientificActivity: ScientificActivity): ScientificActivity {
        repository.findById(scientificActivity.id!!).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Atividade científica com id [${scientificActivity.id}] não existe")

        return repository.save(scientificActivity).awaitSingleOrNull()
            ?: throw ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Não foi possível atualizar a atividade científica [${scientificActivity.id}]. Valor recebido: [$scientificActivity]"
            )
    }
}