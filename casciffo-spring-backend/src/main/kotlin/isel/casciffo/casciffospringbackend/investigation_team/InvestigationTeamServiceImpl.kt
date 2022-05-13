package isel.casciffo.casciffospringbackend.investigation_team

import isel.casciffo.casciffospringbackend.users.UserService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class InvestigationTeamServiceImpl(
    @Autowired val investigationTeamRepository: InvestigationTeamRepository,
    @Autowired val userService: UserService
): InvestigationTeamService {
    override suspend fun findTeamByProposalId(id: Int): Flow<InvestigationTeam> {
        return investigationTeamRepository
            .findInvestigationTeamByProposalId(id)
            .asFlow()
            .map(this::loadMember)
    }

    override suspend fun saveTeam(team: Flux<InvestigationTeam>): Flow<InvestigationTeam> {
        return investigationTeamRepository.saveAll(team).asFlow()
    }

    private suspend fun loadMember(member: InvestigationTeam): InvestigationTeam {
        member.member = userService.getUser(member.memberId!!)
        return member
    }

}