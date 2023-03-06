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
        dossier.clinicalResearchId = researchId
        return repository.save(dossier).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro na atualização do dossier com valor $dossier")
    }

    override suspend fun createDossier(dossier: Dossier, researchId: Int): Dossier {
        dossier.clinicalResearchId = researchId
        return repository.save(dossier).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro na criação do dossier com valor $dossier")
    }

    override suspend fun deleteDossier(researchId: Int, dossierId: Int): Dossier {
        val dossier = repository.findById(dossierId).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.OK)
        repository.deleteById(dossierId).awaitSingleOrNull()
        return dossier
    }
}