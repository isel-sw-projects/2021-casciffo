package isel.casciffo.casciffospringbackend.research.dossier

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ResponseStatusException

@Component
class DossierServiceImpl(
    @Autowired val repository: DossierRepository
): DossierService {
    override suspend fun findAllByResearchId(researchId: Int): Flow<Dossier> {
        return repository.findAllByClinicalResearchId(researchId).asFlow()
    }

    override suspend fun updateDossier(dossier: Dossier, researchId: Int): Dossier {
        repository.findById(dossier.id!!).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested dossier does not exist!!!")
        dossier.clinicalResearchId = researchId
        return repository.save(dossier).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating dossier, value was $dossier")
    }

    override suspend fun createDossier(dossier: Dossier, researchId: Int): Dossier {
        dossier.clinicalResearchId = researchId
        return repository.save(dossier).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error creating dossier, value was $dossier")
    }
}