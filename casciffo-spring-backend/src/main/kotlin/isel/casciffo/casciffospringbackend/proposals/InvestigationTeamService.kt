package isel.casciffo.casciffospringbackend.proposals

import reactor.core.publisher.Mono

interface InvestigationTeamService {
    fun findTeamById(id: Int): Mono<InvestigationTeam>
}
