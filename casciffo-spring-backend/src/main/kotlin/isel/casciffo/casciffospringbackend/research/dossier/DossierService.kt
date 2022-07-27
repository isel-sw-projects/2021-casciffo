package isel.casciffo.casciffospringbackend.research.dossier

import kotlinx.coroutines.flow.Flow

interface DossierService {
    suspend fun findAllByResearchId(researchId: Int): Flow<Dossier>
    suspend fun createDossier(dossier: Dossier, researchId: Int): Dossier
    suspend fun updateDossier(dossier: Dossier, researchId: Int): Dossier
}