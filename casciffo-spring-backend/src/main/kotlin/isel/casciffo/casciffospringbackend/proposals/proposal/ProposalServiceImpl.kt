package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregate
import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregateRepo
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.common.dateDiffInDays
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.exceptions.NonExistentProposalException
import isel.casciffo.casciffospringbackend.exceptions.ProposalNotFoundException
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamService
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsService
import isel.casciffo.casciffospringbackend.proposals.finance.finance.ProposalFinancialService
import isel.casciffo.casciffospringbackend.proposals.finance.partnership.PartnershipService
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventModel
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventRepository
import isel.casciffo.casciffospringbackend.research.research.ResearchModel
import isel.casciffo.casciffospringbackend.research.research.ResearchService
import isel.casciffo.casciffospringbackend.roles.Roles
import isel.casciffo.casciffospringbackend.states.state.StateService
import isel.casciffo.casciffospringbackend.states.state.States
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
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
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDate

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
        val existingProposal = proposalRepository.findById(proposal.id!!).awaitSingleOrNull() ?: throw ProposalNotFoundException()
        if (existingProposal.stateId != proposal.stateId) {
            throw InvalidStateTransitionException("State transition not allowed here!")
        }
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
    override suspend fun transitionState(proposalId: Int, nextStateId: Int, role: Roles): ProposalModel {
        val prop = getProposalById(proposalId)
        return handleStateTransition(prop, nextStateId, role)
    }

    suspend fun handleStateTransition(
        proposal: ProposalModel,
        nextStateId: Int,
        role: Roles
    ): ProposalModel {

        val currState = stateService.findById(proposal.stateId!!)

        //TODO change to ResponseEntity and handle exception in ControllerAdvice
        val nextState = stateService.findById(nextStateId)
        val stateType = if(proposal.type === ResearchType.CLINICAL_TRIAL) StateType.FINANCE_PROPOSAL
        else StateType.STUDY_PROPOSAL

        stateService.verifyNextStateValid(currState.id!!, nextStateId, stateType, role)

        if (stateService.isTerminalState(nextStateId, stateType)) {
            createResearch(proposal)
        }

        if(proposal.timelineEvents != null) {
            updateTimelineEvent(proposal.timelineEvents!!, nextState.name!!)
        }

        stateTransitionService.newTransition(proposal.stateId!!, nextState.id!!, stateType, proposal.id!!)

        proposal.stateId = nextState.id
        proposalRepository.save(proposal).map { proposal.lastModified = it.lastModified }.awaitSingle()
        return proposal
    }

    private suspend fun createResearch(proposal: ProposalModel) {
        //TODO eventually change from ugly hardcoded to prettier database hardcoded..
        // maybe add a field isInitial to determine the first state in each chain type
        val stateAtivo = stateService.findByName(States.ATIVO.name)
        val researchModel = ResearchModel(proposalId = proposal.id, stateId = stateAtivo.id, type = proposal.type)
        researchService.createResearch(researchModel)
    }

    private fun updateTimelineEvent(
        timelineEvents: Flux<TimelineEventModel>,
        state: String
    ) {
        timelineEvents
            .filter(filterEventsByState(state))
            .map (this::setEventCompleted)
            .map (this::setOverDueDays)
            .collectList()
            .switchIfEmpty(Mono.empty())
            .subscribe {
                timelineEventRepository.saveAll(it).subscribe()
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

        if(prop.type == ResearchType.CLINICAL_TRIAL) {
            prop.financialComponent!!.partnerships = partnershipService
                .findAllByProposalFinancialComponentId(prop.financialComponent!!.id!!)
        }
        return prop
    }
}

