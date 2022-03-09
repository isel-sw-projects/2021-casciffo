package isel.casciffo.casciffospringbackend.proposals

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface InvestigationTeamRepository: ReactiveSortingRepository<InvestigationTeam, Int> {
    @Query("SELECT tm.* FROM investigation_team tm " +
            "JOIN proposal p ON tm.proposal_id = p.proposal_id " +
            "WHERE tm.proposal_id = :proposalId ")
    fun findInvestigationTeamByProposalId(proposalId: Int) : Flux<InvestigationTeam>
}