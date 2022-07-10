package isel.casciffo.casciffospringbackend.investigation_team

import isel.casciffo.casciffospringbackend.aggregates.investigation_team.InvestigationTeamAggregate
import isel.casciffo.casciffospringbackend.aggregates.investigation_team.InvestigationTeamAggregateRepo
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.users.user.UserModel
import isel.casciffo.casciffospringbackend.users.user.UserService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class InvestigationTeamServiceImpl(
    @Autowired val investigationTeamRepository: InvestigationTeamRepository,
    @Autowired val investigationTeamAggregateRepo: InvestigationTeamAggregateRepo
): InvestigationTeamService {
    override suspend fun findTeamByProposalId(id: Int): Flux<InvestigationTeamModel> {
        return investigationTeamAggregateRepo
            .findAllByProposalId(id)
            .flatMap(this::mapToModel)
    }

    override suspend fun saveTeam(team: Flux<InvestigationTeamModel>): Flux<InvestigationTeamModel> {
        return investigationTeamRepository.saveAll(team)
    }

    private fun mapToModel(aggregate: InvestigationTeamAggregate): Mono<InvestigationTeamModel> {
        return Mono.just(aggregate)
            .map {
                InvestigationTeamModel(
                    id = aggregate.id,
                    proposalId = aggregate.proposalId,
                    memberRole = aggregate.memberRole,
                    memberId = aggregate.memberId,
                    member = UserModel(
                        userId = aggregate.memberId,
                        name = aggregate.userName,
                        email = aggregate.userEmail
                    )
                )
            }
    }

//    private fun loadMember(member: InvestigationTeamModel): InvestigationTeamModel {
//        member.member = userService.getUser(member.memberId!!)
//        return member
//    }

}