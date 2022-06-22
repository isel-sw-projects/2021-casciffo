package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregate
import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregateRepo
import isel.casciffo.casciffospringbackend.common.dateDiffInDays
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.exceptions.NonExistentProposalException
import isel.casciffo.casciffospringbackend.exceptions.ProposalNotFoundException
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamRepository
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamService
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsService
import isel.casciffo.casciffospringbackend.proposals.constants.PathologyRepository
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceTypeRepository
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticAreaRepository
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialService
import isel.casciffo.casciffospringbackend.proposals.finance.partnership.PartnershipService
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventModel
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventRepository
import isel.casciffo.casciffospringbackend.research.ResearchModel
import isel.casciffo.casciffospringbackend.research.ResearchService
import isel.casciffo.casciffospringbackend.roles.RoleRepository
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
import java.time.LocalDateTime
@Service
class ProposalServiceImpl(
    @Autowired val proposalRepository: ProposalRepository,
    @Autowired val proposalAggregateRepo: ProposalAggregateRepo,
    @Autowired val proposalAggregateMapper: Mapper<ProposalModel, ProposalAggregate>,
    @Autowired val investigationTeamService: InvestigationTeamService,
    @Autowired val stateService: StateService,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val commentsService: ProposalCommentsService,
    @Autowired val proposalFinancialService: ProposalFinancialService,
    @Autowired val timelineEventRepository: TimelineEventRepository,
    @Autowired val researchService: ResearchService,
    @Autowired val partnershipService: PartnershipService,
)
    : ProposalService {

    override suspend fun getAllProposals(type: ResearchType): Flow<ProposalModel> {
        return proposalAggregateRepo.findAllByType(type).asFlow().map(proposalAggregateMapper::mapDTOtoModel)
    }

    override suspend fun getProposalById(id: Int): ProposalModel {
        try {
            val proposalAggregate = proposalAggregateRepo.findByProposalId(id).awaitSingleOrNull()
                    ?: throw NonExistentProposalException()
            val model = proposalAggregateMapper.mapDTOtoModel(proposalAggregate)
            return loadDetails(model)
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
        val prop = getProposalById(proposalId)
        return handleStateTransition(prop, forward)
    }


    suspend fun handleStateTransition(
        existingProposal: ProposalModel,
        forward: Boolean
    ): ProposalModel {

        val currStateName = stateService.findById(existingProposal.stateId!!).name!!
        val currState = States.valueOf(currStateName)
        val nextLocalState: States? = if(forward) currState.getNextState() else currState.getPrevState()
        if(nextLocalState === null) throw InvalidStateTransitionException()

        val nextState = stateService.findByName(nextLocalState.name)

        if (!currState.isNextStateValid(nextLocalState))
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

        existingProposal.stateId = nextState.id
        existingProposal.lastUpdated = LocalDateTime.now()
        proposalRepository.save(existingProposal).awaitSingle()
        return getProposalById(existingProposal.id!!)
    }

    private fun updateTimelineEvent(
        proposal: ProposalModel,
        state: String
    ) {
        proposal.timelineEvents!!
            .filter(filterEventsByState(state))
            .map (this::setEventCompleted)
            .map (this::setOverDueDays)
            .subscribe {
                timelineEventRepository.save(it).subscribe()
            }
    }

    private fun filterEventsByState(state:String) = {
        event: TimelineEventModel -> event.isAssociatedToState && event.stateName === state
    }



    private fun setOverDueDays(event: TimelineEventModel): TimelineEventModel {
        val diff = dateDiffInDays(event.completedDate!!, event.deadlineDate!!)
        if (diff > 0) {
            event.daysOverDue = diff
        }
        return event
    }

    private fun setEventCompleted(event: TimelineEventModel): TimelineEventModel {
        event.completedDate = LocalDate.now()
        return event
    }

    private suspend fun loadDetails(prop: ProposalModel): ProposalModel {
        prop.investigationTeam = investigationTeamService.findTeamByProposalId(prop.id!!).asFlux()

        prop.stateTransitions = stateTransitionService.findAllByReferenceId(prop.id!!).asFlux()

        val page = PageRequest.of(0, 20, Sort.by("dateCreated"))
        prop.comments = commentsService.getComments(prop.id!!, page).asFlux()

        prop.timelineEvents = timelineEventRepository.findTimelineEventsByProposalId(prop.id!!)

        if(prop.financialComponent != null) {
            prop.financialComponent!!.partnerships = partnershipService
                .findAllByProposalFinancialComponentId(prop.financialComponent!!.id!!)
        }
        return prop
    }
}

