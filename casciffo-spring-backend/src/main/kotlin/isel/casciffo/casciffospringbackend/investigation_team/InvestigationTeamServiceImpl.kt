package isel.casciffo.casciffospringbackend.investigation_team

import isel.casciffo.casciffospringbackend.users.UserService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

@Service
class InvestigationTeamServiceImpl(
    @Autowired val investigationTeamRepository: InvestigationTeamRepository,
    @Autowired val userService: UserService
): InvestigationTeamService {
    override suspend fun findTeamByProposalId(id: Int): Flow<InvestigationTeamModel> {
        return investigationTeamRepository
            .findInvestigationTeamByProposalId(id)
            .asFlow()
            .map(this::loadMember)
    }

    override suspend fun saveTeam(team: Flux<InvestigationTeamModel>): Flow<InvestigationTeamModel> {
        return investigationTeamRepository.saveAll(team).asFlow()
    }

    private suspend fun loadMember(member: InvestigationTeamModel): InvestigationTeamModel {
        member.member = userService.getUser(member.memberId!!)
        return member
    }

}