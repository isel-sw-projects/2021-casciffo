package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsRepository
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamRepository
import isel.casciffo.casciffospringbackend.proposals.constants.PathologyRepository
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceTypeRepository
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticAreaRepository
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialService
import isel.casciffo.casciffospringbackend.states.StateRepository
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import isel.casciffo.casciffospringbackend.states.transitions.TransitionType
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import isel.casciffo.casciffospringbackend.users.UserRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ProposalServiceImpl(
    @Autowired val proposalRepository: ProposalRepository,
    @Autowired val serviceTypeRepository: ServiceTypeRepository,
    @Autowired val therapeuticAreaRepository: TherapeuticAreaRepository,
    @Autowired val pathologyRepository: PathologyRepository,
    @Autowired val investigationTeamRepository: InvestigationTeamRepository,
    @Autowired val userRepository: UserRepository,
    @Autowired val stateRepository: StateRepository,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val commentsRepository: ProposalCommentsRepository,
    @Autowired val proposalFinancialService: ProposalFinancialService,
    @Autowired val timelineEventRepository: TimelineEventRepository
)
    : ProposalService {

    override suspend fun getAllProposals(type: ResearchType): Flow<Proposal> =
        proposalRepository.findAllByType(type).asFlow().map(this::loadRelations)

    override suspend fun getProposalById(id: Int): Proposal {
        val proposal = proposalRepository.findById(id).awaitFirstOrNull()
            ?: throw IllegalArgumentException("ProposalId doesnt exist!!!")
        return loadRelations(proposal, true)
    }

    @Transactional
    override suspend fun create(proposal: Proposal): Proposal {
        val createdProposal = proposalRepository.save(proposal).awaitFirstOrNull()
            ?: throw InternalError("Something went wrong creating the proposal")
        val investigationTeamFlux =
            createdProposal
                .investigationTeam!!
                .doOnEach {
                    it.get()?.proposalId = createdProposal.id!!
                }

        createdProposal.investigationTeam =
            investigationTeamRepository
                .saveAll(investigationTeamFlux)

        val hasFinancialComponent = proposal.type == ResearchType.CLINICAL_TRIAL
        if(hasFinancialComponent) {
            createdProposal.financialComponent =
                proposalFinancialService
                    .createProposalFinanceComponent(createdProposal.financialComponent!!)
        }
        return createdProposal
    }

    override suspend fun updateProposal(proposal: Proposal): Proposal {
        val existingProposal = proposalRepository.findById(proposal.id!!).awaitFirstOrNull()
            ?: throw IllegalArgumentException("Proposal doesnt exist!!!")
        val hasStateTransitioned = proposal.stateId == existingProposal.stateId

        if(hasStateTransitioned) {
            stateTransitionService
                .newTransition(existingProposal.stateId, proposal.stateId, TransitionType.PROPOSAL, proposal.id!!)
        }
        return proposalRepository.save(proposal).awaitFirstOrNull() ?: throw Exception("Idk what happened bro ngl")
    }


    private suspend fun loadRelations(proposal: Proposal, isDetailedView: Boolean = false): Proposal {
        var prop = loadConstantRelations(proposal)

        if(prop.type == ResearchType.CLINICAL_TRIAL) {
            prop = loadFinancialComponent(prop)
        }

        if(isDetailedView) {
            prop.investigationTeam =
                investigationTeamRepository
                    .findInvestigationTeamByProposalId(prop.id!!)

            prop.comments = commentsRepository
                .findByProposalId(prop.id!!)

            prop.timelineEvents =
                timelineEventRepository
                    .findTimelineEventsByProposalId(prop.id!!)
        }

        return prop
    }

    private suspend fun loadFinancialComponent(proposal: Proposal): Proposal {
        proposal.financialComponent = proposalFinancialService.findComponentByProposalId(proposal.id!!)
        return proposal
    }

    private suspend fun loadConstantRelations(proposal: Proposal): Proposal {
        proposal.serviceType = serviceTypeRepository.findById(proposal.serviceTypeId).awaitFirstOrNull()

        proposal.pathology = pathologyRepository.findById(proposal.pathologyId).awaitFirstOrNull()

        proposal.therapeuticArea = therapeuticAreaRepository.findById(proposal.therapeuticAreaId).awaitFirstOrNull()

        proposal.state = stateRepository.findById(proposal.stateId).awaitFirstOrNull()

        proposal.principalInvestigator = userRepository.findById(proposal.principalInvestigatorId).awaitFirstOrNull()

        return proposal
    }
}


//  WITH NO COROUTINES; JUST MONO & FLUX SYNTAX
//    override suspend fun getAllProposals(): Flux<Proposal> = proposalRepository.findAll()
//        .flatMap(this::loadRelations)
//
//    override suspend fun getProposalById(id: Int): Proposal =
//        proposalRepository.findById(id).flatMap(this::loadRelations)
//
//    override fun create(proposal: Proposal): Mono<Proposal> {
//        val mono = proposalRepository.save(proposal)
//            .map {
//                proposal = it
//                it.investigationTeam!!.forEach { investigationTeam -> investigationTeam.proposalId = it.id!! }
//                investigationTeamRepository.saveAll(it.investigationTeam!!).collectList()
//            }
//            .map {
//                proposal.investigationTeam = it
//                Mono.just(proposal)
//            }
//        if (proposal.type == ProposalType.OBSERVATIONAL_STUDY) {
//            return mono
//        }
//
//        return mono
//            .map {
//                it.financialComponent!!.proposalId = it.id
//                proposalFinancialService.createProposalFinanceComponent(proposal.financialComponent!!)
//            }.map {
//                proposal.financialComponent = it.
//                Mono.just(proposal)
//            }
//    }
//    private fun loadFinancialComponent(proposal: Proposal): Mono<Proposal> {
//        return proposalFinancialRepository
//            .findByProposalId(proposal.id!!)
//            .map {
//                proposal.financialComponent = it
//                proposal
//            }
//    }
//    private fun loadRelations(proposal: Proposal): Mono<Proposal> {
//        val mono = loadConstantRelations(proposal)
//
//        if(proposal.type == ProposalType.OBSERVATIONAL_STUDY) {
//            return mono
//        }
//
//        return mono.then(loadFinancialComponent(proposal))
//    }
//        private fun loadConstantRelations(proposal: Proposal): Mono<Proposal> {
//            return serviceTypeRepository.findById(proposal.serviceTypeId)
//                .flatMap{
//                    proposal.serviceType = it
//                    pathologyRepository.findById(proposal.pathologyId)
//                }
//                .flatMap{
//                    proposal.pathology = it
//                    therapeuticAreaRepository.findById(proposal.therapeuticAreaId)
//                }
//                .flatMap{
//                    proposal.therapeuticArea = it
//                    stateRepository.findById(proposal.stateId)
//                }
//                .flatMap{
//                    proposal.state = it
//                    userRepository.findById(proposal.principalInvestigatorId)
//                }
//                .flatMap{
//                    proposal.principalInvestigator = it
//                    investigationTeamRepository.findInvestigationTeamByProposalId(proposal.id!!).collectList()
//                }
//                .flatMap{
//                    proposal.investigationTeam = it
//                    commentsRepository.findByProposalId(proposal.id!!).collectList()
//                }
//                .flatMap{
//                    proposal.comments = it
//                    Mono.just(proposal)
//                }
//        }
