package isel.casciffo.casciffospringbackend.aggregates.investigation_team

import isel.casciffo.casciffospringbackend.investigation_team.InvestigatorRole
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface InvestigationTeamAggregateRepo: ReactiveCrudRepository<InvestigationTeamAggregate, Int> {
//    var id: Int? = null,
//
//    var proposalId: Int? = null,
//    var memberRole: InvestigatorRole? = null,
//    var memberId: Int? = null,
//
//    var memberName: String? = null,
//    var memberEmail: String? = null
    @Query(
        "SELECT it.team_id as id, it.proposal_id, it.member_role, it.member_id, " +
                "ua.user_name, ua.user_email " +
        "FROM investigation_team it " +
        "JOIN user_account ua on ua.user_id = it.member_id " +
        "WHERE it.proposal_id=:proposalId"
    )
    fun findAllByProposalId(proposalId: Int): Flux<InvestigationTeamAggregate>
}