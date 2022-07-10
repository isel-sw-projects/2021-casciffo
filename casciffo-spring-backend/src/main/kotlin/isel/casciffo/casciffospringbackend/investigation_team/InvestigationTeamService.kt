package isel.casciffo.casciffospringbackend.investigation_team

import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux

interface InvestigationTeamService {
    suspend fun findTeamByProposalId(id: Int): Flux<InvestigationTeamModel>
    suspend fun saveTeam(team: Flux<InvestigationTeamModel>): Flux<InvestigationTeamModel>
}
