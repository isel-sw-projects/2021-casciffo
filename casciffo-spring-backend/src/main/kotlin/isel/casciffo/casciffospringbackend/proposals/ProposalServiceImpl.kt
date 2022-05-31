package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.exceptions.ProposalNotFoundException
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamRepository
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamService
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsService
import isel.casciffo.casciffospringbackend.proposals.constants.PathologyRepository
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceTypeRepository
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticAreaRepository
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialService
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventRepository
import isel.casciffo.casciffospringbackend.research.ResearchModel
import isel.casciffo.casciffospringbackend.research.ResearchService
import isel.casciffo.casciffospringbackend.roles.UserRoleRepository
import isel.casciffo.casciffospringbackend.states.StateService
import isel.casciffo.casciffospringbackend.states.States
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import isel.casciffo.casciffospringbackend.states.transitions.TransitionType
import isel.casciffo.casciffospringbackend.users.UserRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class ProposalServiceImpl(
    @Autowired val proposalRepository: ProposalRepository,
    @Autowired val serviceTypeRepository: ServiceTypeRepository,
    @Autowired val therapeuticAreaRepository: TherapeuticAreaRepository,
    @Autowired val pathologyRepository: PathologyRepository,
    @Autowired val investigationTeamRepository: InvestigationTeamRepository,
    @Autowired val investigationTeamService: InvestigationTeamService,
    @Autowired val userRepository: UserRepository,
    @Autowired val roleRepository: UserRoleRepository,
    @Autowired val stateService: StateService,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val commentsService: ProposalCommentsService,
    @Autowired val proposalFinancialService: ProposalFinancialService,
    @Autowired val timelineEventRepository: TimelineEventRepository,
    @Autowired val researchService: ResearchService
)
    : ProposalService {

    override suspend fun getAllProposals(type: ResearchType): Flow<ProposalModel> {
        return proposalRepository.findAllByType(type).asFlow().map(this::loadRelations)
    }

    override suspend fun getProposalById(id: Int): ProposalModel {
        try {
            val proposal = proposalRepository.findById(id).awaitSingle()
            return loadRelations(proposal, true)
        } catch (e: NoSuchElementException) {
            throw IllegalArgumentException("ProposalId doesnt exist!!!")
        }
    }

    @Transactional
    override suspend fun create(proposal: ProposalModel): ProposalModel {
        setProposalStateToDefault(proposal)

        val createdProposal = proposalRepository.save(proposal).awaitSingle()

        createInvestigationTeam(proposal, createdProposal)

        val hasFinancialComponent = proposal.type == ResearchType.CLINICAL_TRIAL
        if(hasFinancialComponent) {
            createFinancialComponent(proposal, createdProposal)
        }
        return createdProposal
    }

    private suspend fun setProposalStateToDefault(proposal: ProposalModel) {
        proposal.stateId = stateService.findByName(States.SUBMETIDO.name).id
    }

    private suspend fun createFinancialComponent(
        proposal: ProposalModel,
        createdProposal: ProposalModel
    ) {
        proposal.financialComponent!!.proposalId = createdProposal.id
        createdProposal.financialComponent =
            proposalFinancialService
                .createProposalFinanceComponent(proposal.financialComponent!!)
    }

    private suspend fun createInvestigationTeam(
        proposal: ProposalModel,
        createdProposal: ProposalModel
    ) {
        val investigators =
            proposal.investigationTeam!!
                .map {
                    it.proposalId = createdProposal.id!!
                    it
                }

        createdProposal.investigationTeam = investigationTeamService.saveTeam(investigators).asFlux()
    }

    @Transactional
    override suspend fun updateProposal(proposal: ProposalModel): ProposalModel {
        proposalRepository.findById(proposal.id!!).awaitSingleOrNull() ?: throw ProposalNotFoundException()

//        val hasStateTransitioned = proposal.stateId != existingProposal.stateId
//
//        if (hasStateTransitioned) {
//            handleStateTransition(proposal, existingProposal)
//        }

        proposalRepository.save(proposal).awaitSingleOrNull() ?: throw Exception("Idk what happened bro ngl")
        return proposal
    }

    @Transactional
    override suspend fun deleteProposal(proposalId: Int): ProposalModel {
        val prop = proposalRepository.findById(proposalId).awaitSingleOrNull() ?: throw ProposalNotFoundException()
        proposalRepository.deleteById(proposalId).awaitSingle()
        return prop
    }


    @Transactional
    override suspend fun advanceState(proposalId: Int, forward: Boolean): ProposalModel {
        //FIXME this call throws NoSuchElementException despite the id existing.
        // The error is not thrown in different contexts with the same Id,
        // be it in the controller#getById, service#getById or repo#getById
        val prop = getProposalById(proposalId)
        handleStateTransition(prop, forward)
        return prop
    }


    suspend fun handleStateTransition(
        existingProposal: ProposalModel,
        forward: Boolean
    ) {

        val currState = States.valueOf(stateService.findById(existingProposal.stateId!!).name)
        //fixme add verification of user permissions to make sure he can or not advance
        val nextLocalState: States? = if(forward) currState.getNextState() else currState.getPrevState()
        if(nextLocalState === null) throw InvalidStateTransitionException()

        val nextState = stateService.findByName(nextLocalState.name)

        if (currState.isNextStateValid(nextLocalState))
            throw InvalidStateTransitionException()

        if (nextLocalState.isCompleted()) {
            val stateAtivo = stateService.findByName(States.ATIVO.name)
            val researchModel = ResearchModel(null, existingProposal.id, stateAtivo.id)
            researchService.createResearch(researchModel)
        }

        if(existingProposal.timelineEvents !== null) {
            updateTimelineEvent(existingProposal, nextLocalState.name)
        }

        stateTransitionService
            .newTransition(existingProposal.stateId!!, nextState.id!!, TransitionType.PROPOSAL, existingProposal.id!!)
    }

    private fun updateTimelineEvent(
        proposal: ProposalModel,
        state: String
    ) {
        proposal.timelineEvents!!
            .filter {
                it.stateName === state
            }.map {
                it.completedDate = LocalDate.now()
                it
            }.map {
                val diff = it.completedDate!!.dayOfYear - it.deadlineDate!!.dayOfYear
                if(diff > 0)
                    it.daysOverDue = diff
                it
            }.subscribe {
                timelineEventRepository.save(it)
            }
    }


    private suspend fun loadRelations(proposal: ProposalModel, isDetailedView: Boolean = false): ProposalModel {
        var prop = loadConstantRelations(proposal)

        if(prop.type == ResearchType.CLINICAL_TRIAL) {
            prop = loadFinancialComponent(prop, isDetailedView)
        }

        if(isDetailedView) {
            loadDetails(prop)
        }

        return prop
    }

    private suspend fun loadDetails(prop: ProposalModel) {
        prop.investigationTeam = investigationTeamService.findTeamByProposalId(prop.id!!).asFlux()

        prop.stateTransitions = stateTransitionService.findAllByReferenceId(prop.id!!).asFlux()

        val page = PageRequest.of(0, 20, Sort.by("dateCreated"))
        prop.comments = commentsService.getComments(prop.id!!, page).asFlux()

        prop.timelineEvents = timelineEventRepository.findTimelineEventsByProposalId(prop.id!!)
    }

    private suspend fun loadFinancialComponent(proposal: ProposalModel, isDetailedView: Boolean): ProposalModel {
        proposal.financialComponent = proposalFinancialService.findComponentByProposalId(proposal.id!!, isDetailedView)
        return proposal
    }

    private suspend fun loadConstantRelations(proposal: ProposalModel): ProposalModel {
        proposal.serviceType = serviceTypeRepository.findById(proposal.serviceTypeId!!).awaitSingle()

        proposal.pathology = pathologyRepository.findById(proposal.pathologyId!!).awaitSingle()

        proposal.therapeuticArea = therapeuticAreaRepository.findById(proposal.therapeuticAreaId!!).awaitSingle()

        proposal.state = stateService.findById(proposal.stateId!!)

        proposal.principalInvestigator = userRepository.findById(proposal.principalInvestigatorId!!).awaitSingle()

        return proposal
    }
}
