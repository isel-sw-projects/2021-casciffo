package isel.casciffo.casciffospringbackend.proposals

import org.springframework.data.domain.Pageable
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ProposalRepository : ReactiveSortingRepository<ProposalModel, Int> {

    fun findByPrincipalInvestigatorId(id: Int): Flux<ProposalModel>
    fun findAllByType(type: ResearchType, pageable: Pageable) : Flux<ProposalModel>
    fun findAllByType(type: ResearchType) : Flux<ProposalModel>
}