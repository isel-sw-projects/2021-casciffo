package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.comments.ProposalCommentsRepository
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamRepository
import isel.casciffo.casciffospringbackend.proposals.constants.PathologyRepository
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceTypeRepository
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticAreaRepository
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinanceService
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialRepository
import isel.casciffo.casciffospringbackend.states.StateRepository
import isel.casciffo.casciffospringbackend.users.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class ProposalServiceImpl(@Autowired val proposalRepository: ProposalRepository,
                          @Autowired val serviceTypeRepository: ServiceTypeRepository,
                          @Autowired val therapeuticAreaRepository: TherapeuticAreaRepository,
                          @Autowired val pathologyRepository: PathologyRepository,
                          @Autowired val investigationTeamRepository: InvestigationTeamRepository,
                          @Autowired val userRepository: UserRepository,
                          @Autowired val stateRepository: StateRepository,
                          @Autowired val commentsRepository: ProposalCommentsRepository,
                          @Autowired val proposalFinancialRepository: ProposalFinancialRepository,
                          @Autowired val proposalFinanceService: ProposalFinanceService
)
    : ProposalService {
    override fun getAllProposals(): Flux<Proposal>
        = proposalRepository.findAll().flatMap(this::loadRelations)

    override fun getProposalById(id: Int): Mono<Proposal>
        = proposalRepository.findById(id).flatMap(this::loadRelations)

    private fun loadRelations(proposal: Proposal): Mono<Proposal> {
        val mono = loadConstantRelations(proposal)

        if(proposal.type == ProposalType.OBSERVATIONAL_STUDY) {
            return mono
        }

        return mono.then(loadFinancialComponent(proposal))
    }

    private fun loadFinancialComponent(proposal: Proposal): Mono<Proposal> {
        return Mono.just(proposal)
            .zipWith(proposalFinancialRepository.findByProposalId(proposal.id!!))
            .map { it.t1.financialComponent = it.t2; return@map it.t1 }
    }
    private fun loadConstantRelations(proposal: Proposal): Mono<Proposal> {
        return Mono.just(proposal)
            .zipWith(serviceTypeRepository.findById(proposal.serviceTypeId))
            .map{
                it.t1.serviceType = it.t2
                return@map it.t1
            }.zipWith(pathologyRepository.findById(proposal.pathologyId))
            .map{
                it.t1.pathology = it.t2
                return@map it.t1
            }.zipWith(therapeuticAreaRepository.findById(proposal.therapeuticAreaId))
            .map{
                it.t1.therapeuticArea = it.t2
                return@map it.t1
            }.zipWith(stateRepository.findById(proposal.stateId))
            .map{
                it.t1.state = it.t2
                return@map it.t1
            }.zipWith(userRepository.findById(proposal.principalInvestigatorId))
            .map{
                it.t1.principalInvestigator = it.t2
                return@map it.t1
            }
            .zipWith(investigationTeamRepository.findInvestigationTeamByProposalId(proposal.id!!).collectList())
            .map{
                it.t1.investigationTeam = it.t2
                return@map it.t1
            }.zipWith(commentsRepository.findByProposalId(proposal.id!!).collectList())
            .map{
                it.t1.comments = it.t2
                return@map it.t1
            }
    }

}