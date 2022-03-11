package isel.casciffo.casciffospringbackend.investigation_team

import reactor.core.publisher.Mono

interface InvestigationTeamService {
    fun findTeamById(id: Int): Mono<InvestigationTeam>
}
