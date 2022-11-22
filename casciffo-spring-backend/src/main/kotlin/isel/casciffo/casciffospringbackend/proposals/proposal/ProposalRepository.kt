package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.common.CountHolder
import isel.casciffo.casciffospringbackend.common.ResearchType
import org.springframework.data.domain.Pageable
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface ProposalRepository : ReactiveSortingRepository<ProposalModel, Int> {

    @Query(
        "SELECT COUNT(*) " +
                "FROM proposal p " +
                "WHERE p.proposal_type = :type"
    )
    fun getCountByType(type: ResearchType): Mono<Int>

    @Query(
        "SELECT COUNT(*) filter ( where p.proposal_type = 'OBSERVATIONAL_STUDY' ) as studies, " +
        "COUNT(*) filter ( where p.proposal_type = 'CLINICAL_TRIAL' ) as trials " +
        "FROM proposal p"
    )
    fun countTypes(): Mono<CountHolder>
    fun findByPrincipalInvestigatorId(id: Int): Flux<ProposalModel>
    fun findAllByType(type: ResearchType, pageable: Pageable) : Flux<ProposalModel>
    fun findAllByType(type: ResearchType) : Flux<ProposalModel>
}