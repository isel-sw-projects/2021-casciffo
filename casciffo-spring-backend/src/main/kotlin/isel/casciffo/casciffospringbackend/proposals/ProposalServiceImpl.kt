package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.exceptions.CannotUpdateCancelledProposalException
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.exceptions.ProposalNotFoundException
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsRepository
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamRepository
import isel.casciffo.casciffospringbackend.proposals.constants.PathologyRepository
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceTypeRepository
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticAreaRepository
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialService
import isel.casciffo.casciffospringbackend.research.Research
import isel.casciffo.casciffospringbackend.research.ResearchService
import isel.casciffo.casciffospringbackend.roles.UserRoleRepository
import isel.casciffo.casciffospringbackend.states.StateRepository
import isel.casciffo.casciffospringbackend.states.States
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import isel.casciffo.casciffospringbackend.states.transitions.TransitionType
import isel.casciffo.casciffospringbackend.users.UserRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Mono
import kotlin.math.abs

@Service
class ProposalServiceImpl(
    @Autowired val proposalRepository: ProposalRepository,
    @Autowired val serviceTypeRepository: ServiceTypeRepository,
    @Autowired val therapeuticAreaRepository: TherapeuticAreaRepository,
    @Autowired val pathologyRepository: PathologyRepository,
    @Autowired val investigationTeamRepository: InvestigationTeamRepository,
    @Autowired val userRepository: UserRepository,
    @Autowired val roleRepository: UserRoleRepository,
    @Autowired val stateRepository: StateRepository,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val commentsRepository: ProposalCommentsRepository,
    @Autowired val proposalFinancialService: ProposalFinancialService,
    @Autowired val timelineEventRepository: TimelineEventRepository,
    @Autowired val researchService: ResearchService
)
    : ProposalService {

    override suspend fun getAllProposals(type: ResearchType): Flow<ProposalModel> {
        return proposalRepository.findAllByType(type).asFlow().map(this::loadRelations)
    }

    override suspend fun getProposalById(id: Int): ProposalModel {
        val proposal = proposalRepository.findById(id).awaitSingleOrNull()
            ?: throw IllegalArgumentException("ProposalId doesnt exist!!!")
        return loadRelations(proposal, true)
    }

    @Transactional
    override suspend fun create(proposal: ProposalModel): ProposalModel {
        val createdProposal = proposalRepository.save(proposal).awaitSingle()

        val investigationTeamFlux =
            proposal.investigationTeam!!
                .doOnEach {
                    it.get()?.proposalId = createdProposal.id!!
                }

        createdProposal.investigationTeam =
            investigationTeamRepository
                .saveAll(investigationTeamFlux)

        val hasFinancialComponent = proposal.type == ResearchType.CLINICAL_TRIAL
        if(hasFinancialComponent) {
            proposal.financialComponent!!.proposalId = createdProposal.id
            createdProposal.financialComponent =
                proposalFinancialService
                    .createProposalFinanceComponent(proposal.financialComponent!!)
        }
        return createdProposal
    }

    @Transactional
    override suspend fun updateProposal(proposal: ProposalModel): ProposalModel {
        print(proposal)
        val existingProposal = proposalRepository.findById(proposal.id!!).awaitSingleOrNull()
            ?: throw ProposalNotFoundException()

        val hasStateTransitioned = proposal.stateId != existingProposal.stateId

        if (hasStateTransitioned) {
            handleStateTransition(proposal, existingProposal)
        }

        proposalRepository.save(proposal).awaitSingleOrNull() ?: throw Exception("Idk what happened bro ngl")
        return proposal
    }

    //todo REPLACE STATE REPOSITORY WITH STATE SERVICE
    private suspend fun handleStateTransition(
        proposal: ProposalModel,
        existingProposal: ProposalModel
    ) {
        val nextState  = stateRepository.findById(proposal.stateId!!).awaitSingle()
        val currState = stateRepository.findById(existingProposal.stateId!!).awaitSingle()

        if (currState.stateName == States.CANCELADO.name) throw CannotUpdateCancelledProposalException()
        val isValidStateTransition =
            abs(States.valueOf(nextState.stateName).code - States.valueOf(currState.stateName).code) == 1

        if (!isValidStateTransition)
            throw InvalidStateTransitionException()

        if (nextState.stateName == States.VALIDADO.name) {
            val stateAtivo = stateRepository.findByStateName(States.ATIVO.name)
            val research = Research(null, proposal.id, stateAtivo.stateId)
            researchService.createResearch(research)
        }

        stateTransitionService
            .newTransition(existingProposal.stateId!!, proposal.stateId!!, TransitionType.PROPOSAL, proposal.id!!)
    }

    @Transactional
    override suspend fun deleteProposal(proposalId: Int): ProposalModel {
        val prop = proposalRepository.findById(proposalId).awaitSingleOrNull() ?: throw ProposalNotFoundException()
        proposalRepository.deleteById(proposalId)
        return prop
    }


    private suspend fun loadRelations(proposal: ProposalModel, isDetailedView: Boolean = false): ProposalModel {
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

    private suspend fun loadFinancialComponent(proposal: ProposalModel): ProposalModel {
        proposal.financialComponent = proposalFinancialService.findComponentByProposalId(proposal.id!!)
        return proposal
    }

    private suspend fun loadConstantRelations(proposal: ProposalModel): ProposalModel {
        proposal.serviceType = serviceTypeRepository.findById(proposal.serviceTypeId!!).awaitSingle()

        proposal.pathology = pathologyRepository.findById(proposal.pathologyId!!).awaitSingle()

        proposal.therapeuticArea = therapeuticAreaRepository.findById(proposal.therapeuticAreaId!!).awaitSingle()

        proposal.state = stateRepository.findById(proposal.stateId!!).awaitSingle()

        proposal.principalInvestigator = userRepository.findById(proposal.principalInvestigatorId!!).awaitSingle()

        return proposal
    }
}
