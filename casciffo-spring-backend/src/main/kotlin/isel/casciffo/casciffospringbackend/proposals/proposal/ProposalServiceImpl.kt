package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregate
import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregateRepo
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.common.dateDiffInDays
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.exceptions.NonExistentProposalException
import isel.casciffo.casciffospringbackend.exceptions.ProposalNotFoundException
import isel.casciffo.casciffospringbackend.files.FileInfoRepository
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
import isel.casciffo.casciffospringbackend.security.BearerToken
import isel.casciffo.casciffospringbackend.security.JwtSupport
import isel.casciffo.casciffospringbackend.states.state.StateService
import isel.casciffo.casciffospringbackend.states.state.States
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import isel.casciffo.casciffospringbackend.users.user.UserService
import isel.casciffo.casciffospringbackend.validations.ValidationComment
import isel.casciffo.casciffospringbackend.validations.ValidationsRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import java.nio.file.Path
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
    @Autowired val validationsRepository: ValidationsRepository,
    @Autowired val fileInfoRepository: FileInfoRepository,
    @Autowired val jwtSupport: JwtSupport,
    @Autowired val userService: UserService
) : ProposalService {

    override suspend fun getAllProposals(type: ResearchType): Flow<ProposalModel> {
        return proposalAggregateRepo.findAllByType(type).asFlow().map(proposalAggregateMapper::mapDTOtoModel)
    }

    override suspend fun getProposalById(id: Int, loadDetails: Boolean): ProposalModel {
        try {
            val proposalAggregate = proposalAggregateRepo.findByProposalId(id).awaitSingleOrNull()
                    ?: throw NonExistentProposalException()
            val model = proposalAggregateMapper.mapDTOtoModel(proposalAggregate)
            return if(loadDetails) loadDetails(model) else model
        } catch (e: NoSuchElementException) {
            throw IllegalArgumentException("ProposalId doesnt exist!!!")
        }
    }

    @Transactional
    override suspend fun create(proposal: ProposalModel): ProposalModel {
        verifyProposalKeyFields(proposal)
        setProposalStateToDefault(proposal)

        val createdProposal = proposalRepository.save(proposal).awaitSingle()

        createInvestigationTeam(proposal, createdProposal)

        val hasFinancialComponent = proposal.type == ResearchType.CLINICAL_TRIAL
        if(hasFinancialComponent) {
            createFinancialComponent(proposal, createdProposal)
        }
        return createdProposal
    }

    private suspend fun verifyProposalKeyFields(proposal: ProposalModel) {
        if(proposal.pathologyId == null || proposal.serviceTypeId == null
            || proposal.therapeuticAreaId == null || proposal.principalInvestigatorId == null
        ) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Proposal key fields cannot be null!")
        }
        val isValid = proposalAggregateRepo.areForeignKeysValid(
            proposal.pathologyId!!,
            proposal.serviceTypeId!!,
            proposal.therapeuticAreaId!!,
            proposal.principalInvestigatorId!!
        ).awaitSingle()

        if(!isValid)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Some proposal key fields do not exist!")
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

        createdProposal.investigationTeam = investigationTeamService.saveTeam(investigators)
    }

    override suspend fun downloadCF(proposalId: Int, pfcId: Int): Path  {
        return proposalFinancialService.getCF(pfcId)
    }

    @Transactional
    override suspend fun uploadCF(proposalId: Int, pfcId: Int, file: FilePart?) {
        if(file == null)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "File cannot be null!!")
        proposalFinancialService.createCF(file, pfcId)
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
    override suspend fun transitionStateV2(
        proposalId: Int,
        nextStateId: Int,
        request: ServerHttpRequest
    ): ProposalModel {
        val token = request.headers.getFirst(HttpHeaders.AUTHORIZATION)!!
        val bearer = BearerToken(token.substringAfter("Bearer "))
        val userEmail = jwtSupport.getUserEmail(bearer)
        val user = userService.findUserByEmail(userEmail)!!
        val userRoles = user.roles!!.map { it.roleName!! }.collectList().awaitSingle()
        val prop = getProposalById(proposalId, false)
        return handleStateTransitionV2(prop, nextStateId, userRoles)
    }

    suspend fun handleStateTransitionV2(
        proposal: ProposalModel,
        nextStateId: Int,
        role: List<String>
    ): ProposalModel {

        val currState = stateService.findById(proposal.stateId!!)


        val nextState = stateService.findById(nextStateId)

        val isClinicalTrial = proposal.type === ResearchType.CLINICAL_TRIAL
        val stateType = if(isClinicalTrial) StateType.FINANCE_PROPOSAL
        else StateType.STUDY_PROPOSAL

        stateService.verifyNextStateValidV2(currState.id!!, nextStateId, stateType, role)
        if(isClinicalTrial && currState.name == States.VALIDACAO_CF.name) {
            //TODO MERGE VALIDATIONS INTO STATES
            val check = validationsRepository.isPfcValidatedByProposalId(proposal.id!!).awaitSingle()
            if(!check) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot advance state without the required validations!")
            }
        }
        if (stateService.isTerminalState(nextStateId, stateType)) {
            if (isClinicalTrial) {
                val fullyValidated = validationsRepository.isPfcFullyValidated(proposal.id!!).awaitSingle()
                if (!fullyValidated)
                    throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Financial component must be fully validated before advancing."
                    )
            }
            createResearch(proposal)
        }

        if(proposal.timelineEvents != null) {
            updateTimelineEvent(proposal.timelineEvents!!, nextState.name!!)
        }

        stateTransitionService.newTransition(proposal.stateId!!, nextState.id!!, stateType, proposal.id!!)

        proposal.stateId = nextState.id
        proposal.state = nextState
        return proposalRepository.save(proposal).awaitSingle()
    }

    @Transactional
    override suspend fun transitionState(proposalId: Int, nextStateId: Int, role: Roles): ProposalModel {
        val prop = getProposalById(proposalId, false)
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

        val isClinicalTrial = proposal.type === ResearchType.CLINICAL_TRIAL
        val stateType = if(isClinicalTrial) StateType.FINANCE_PROPOSAL
        else StateType.STUDY_PROPOSAL

        stateService.verifyNextStateValid(currState.id!!, nextStateId, stateType, role)
        if(isClinicalTrial && currState.name === States.VALIDACAO_CF.name) {
            //TODO MERGE VALIDATIONS INTO STATES
            val check = validationsRepository.isPfcValidatedByProposalId(proposal.id!!).awaitSingle()
            if(!check) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot advance state without the required validations!")
            }
        }

        if (stateService.isTerminalState(nextStateId, stateType)) {
            if (isClinicalTrial) {
                val fullyValidated = validationsRepository.isPfcFullyValidated(proposal.id!!).awaitSingle()
                if (!fullyValidated)
                    throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Financial component must be fully validated before advancing."
                    )
            }
            createResearch(proposal)
        }

        if(proposal.timelineEvents != null) {
            updateTimelineEvent(proposal.timelineEvents!!, nextState.name!!)
        }

        stateTransitionService.newTransition(proposal.stateId!!, nextState.id!!, stateType, proposal.id!!)

        proposal.stateId = nextState.id
        proposal.state = nextState
        return proposalRepository.save(proposal).awaitSingle()
    }

    @Transactional
    override suspend fun validatePfc(
        proposalId: Int,
        pfcId: Int,
        validationComment: ValidationComment
    ): ProposalValidationModel {
        val wasValid = validationsRepository.isPfcValidatedByPfcId(pfcId).awaitSingle()
        if(wasValid) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Financial component already valid!")
        val c = commentsService.createComment(validationComment.comment!!)
        validationComment.comment = c
        val res = proposalFinancialService.validate(pfcId, validationComment)
        val isNowValidated = validationsRepository.isPfcValidatedByPfcId(pfcId).awaitSingle()
        if(isNowValidated) {
            val nextState = stateService.getNextProposalState(proposalId, StateType.FINANCE_PROPOSAL)
            transitionState(proposalId, nextState.id!!, Roles.SUPERUSER)
        }
        val proposal: ProposalModel = getProposalById(proposalId, true)
        return ProposalValidationModel(proposal, res)
    }

    private suspend fun createResearch(proposal: ProposalModel) {
        val stateAtivo = stateService.findInitialStateByType(StateType.RESEARCH)
        val researchModel = ResearchModel(proposalId = proposal.id, stateId = stateAtivo.id, type = proposal.type)
        researchService.createResearch(researchModel)
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

    private fun updateTimelineEvent(
        timelineEvents: Flux<TimelineEventModel>,
        state: String
    ) {
        timelineEvents
            .filter(filterEventsByState(state))
            .map (this::setEventCompleted)
            .map (this::setOverDueDays)
            .collectList()
            .subscribe {
                timelineEventRepository.saveAll(it).subscribe()
            }
    }

    private suspend fun loadDetails(prop: ProposalModel): ProposalModel {
        prop.investigationTeam = investigationTeamService.findTeamByProposalId(prop.id!!)

        val type = if(prop.type === ResearchType.CLINICAL_TRIAL) StateType.FINANCE_PROPOSAL
        else StateType.STUDY_PROPOSAL

        prop.stateTransitions = stateTransitionService.findAllByRefId(prop.id!!, type)

        val page = PageRequest.of(0, 20, Sort.by("dateCreated"))
        prop.comments = commentsService.getComments(prop.id!!, page)

        prop.timelineEvents = timelineEventRepository.findTimelineEventsByProposalId(prop.id!!)

        if(prop.type == ResearchType.CLINICAL_TRIAL) {
            prop.financialComponent!!.partnerships = partnershipService.findAllByProposalFinancialComponentId(prop.financialComponent!!.id!!)
            prop.financialComponent!!.validations = validationsRepository.findAllByPfcId(prop.financialComponent!!.id!!)
        }
        return prop
    }
}

