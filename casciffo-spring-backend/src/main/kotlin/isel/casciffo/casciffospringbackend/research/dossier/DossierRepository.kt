package isel.casciffo.casciffospringbackend.research.dossier

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface DossierRepository: ReactiveCrudRepository<Dossier, Int> {


    fun findAllByClinicalResearchId(cri: Int): Flux<Dossier>
}