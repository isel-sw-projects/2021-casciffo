package isel.casciffo.casciffospringbackend.investigation_team

import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux

interface InvestigationTeamService {
    suspend fun findTeamByProposalId(id: Int): Flow<InvestigationTeam>
    suspend fun saveTeam(team: Flux<InvestigationTeam>): Flow<InvestigationTeam>
}
