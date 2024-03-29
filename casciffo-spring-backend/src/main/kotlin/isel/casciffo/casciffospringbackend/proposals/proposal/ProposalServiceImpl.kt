package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregate
import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregateRepo
import isel.casciffo.casciffospringbackend.common.*
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.exceptions.NonExistentProposalException
import isel.casciffo.casciffospringbackend.exceptions.ProposalNotFoundException
import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.files.FileService
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamService
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.proposal_research.ProposalResearch
import isel.casciffo.casciffospringbackend.proposal_research.ProposalResearchRepository
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
import isel.casciffo.casciffospringbackend.statistics.ProposalStats
import isel.casciffo.casciffospringbackend.statistics.ProposalStatsRepo
import isel.casciffo.casciffospringbackend.users.notifications.NotificationModel
import isel.casciffo.casciffospringbackend.users.notifications.NotificationService
import isel.casciffo.casciffospringbackend.users.user.UserService
import isel.casciffo.casciffospringbackend.validations.ValidationComment
import isel.casciffo.casciffospringbackend.validations.ValidationsRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
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
import reactor.kotlin.core.publisher.toFlux
import java.nio.file.Path
import java.time.LocalDate

//TODO CHANGE REPOSITORIES TO SERVICES
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
    @Autowired val jwtSupport: JwtSupport,
    @Autowired val userService: UserService,
    @Autowired val proposalStats: ProposalStatsRepo,
    @Autowired val notificationService: NotificationService,
    @Autowired val proposalResearchRepository: ProposalResearchRepository,
    @Autowired val fileInfoService: FileService
) : ProposalService {

    override suspend fun getProposalCount(): CountHolder {
        return proposalRepository.countTypes().awaitSingle()
    }

    override suspend fun getAllProposals(type: ResearchType, pageRequest: PageRequest?): Flow<ProposalModel> {
        //todo pagination
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

    @Transactional(rollbackFor = [ResponseStatusException::class])
    override suspend fun create(proposal: ProposalModel): ProposalModel {
        verifyProposalKeyFields(proposal)
        setProposalStateToDefault(proposal)

        val createdProposal = proposalRepository.save(proposal).awaitSingle()

        createInvestigationTeam(proposal, createdProposal)

        val hasFinancialComponent = proposal.type == ResearchType.CLINICAL_TRIAL
        if(hasFinancialComponent) {
//            if(file == null) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Uma proposta de ensaio clínica tem de ter um contracto!")
            createFinancialComponent(proposal, createdProposal)
            userService.notifyRoles(
                listOf(Roles.FINANCE, Roles.JURIDICAL),
                notificationModel = NotificationModel(
                    title = "Contrato financeiro para revisão.",
                    description = "Proposta com sigla ${proposal.sigla}, espera validação do contrato financeiro.",
                    ids = convertToJson(listOf(Pair("proposalId", proposal.id!!))),
                    notificationType = NotificationType.PROPOSAL_FINANCE
                )
            )
        }
        notifyUser(proposal.principalInvestigatorId!!, proposal.id!!, NotificationType.PROPOSAL_SUBMITTED,
            "Proposta submetida!", "A proposta com sigla ${proposal.sigla} foi submetida com sucesso!")
        return createdProposal
    }

    private suspend fun notifyUser(userId: Int, proposalId: Int, nType: NotificationType, title: String, desc: String) {

        val notification = NotificationModel(
            userId = userId,
            title = title,
            description = desc,
            ids = convertToJson(listOf(Pair("proposalId", proposalId))),
            notificationType = nType,
            viewed = false
        )
        notificationService.createNotification(userId, notification)
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
    override suspend fun uploadCF(proposalId: Int, pfcId: Int, file: FilePart?): FileInfo {
        if(file == null)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O ficheiro tem de ser especificado!")
        return proposalFinancialService.createCF(file, pfcId)
    }

    @Transactional
    override suspend fun updateProposal(proposal: ProposalModel): ProposalModel {
        val existingProposal = proposalRepository.findById(proposal.id!!).awaitSingleOrNull() ?: throw ProposalNotFoundException()
        if (existingProposal.stateId != proposal.stateId) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Transição de estado não é permitida aqui!")
        }
        proposalRepository.save(proposal).awaitSingleOrNull() ?: throw Exception("Idk what happened bro ngl")
        return proposal
    }

    @Transactional
    override suspend fun deleteProposal(proposalId: Int): ProposalModel {
        val prop = proposalRepository.findById(proposalId).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Proposta [$proposalId] não existe!")
        proposalRepository.deleteById(proposalId).awaitSingle()
        return prop
    }

    /**
     * Returns global stats for proposals grouped by researchType.
     */
    override suspend fun getProposalStats(): Flow<ProposalStats> {
        return proposalStats.findProposalStats().asFlow()
    }

    /**
     * @param n Number of elements to retrieve.
     * @return [n] Proposals sorted by last_modified descending.
     */
    override suspend fun getLatestModifiedProposals(n: Int): Flow<ProposalModel> {
        val proposals = proposalAggregateRepo.findLastModifiedProposals(n)
        return proposals
            .asFlow()
            .map { proposalAggregateMapper.mapDTOtoModel(it) }
    }

    @Transactional(rollbackFor = [ResponseStatusException::class])
    override suspend fun transitionState(
        proposalId: Int,
        nextStateId: Int,
        request: ServerHttpRequest
    ): ProposalModel {
        val userRoles = userService.getUserRolesFromRequest(request)
        val prop = getProposalById(proposalId, false)
        return handleStateTransition(prop, nextStateId, userRoles)
    }


    suspend fun handleStateTransition(
        proposal: ProposalModel,
        nextStateId: Int,
        role: List<String>
    ): ProposalModel {

        val currState = stateService.findById(proposal.stateId!!)

        val nextState = stateService.findById(nextStateId)

        val isClinicalTrial = proposal.type === ResearchType.CLINICAL_TRIAL
        val stateType = if(isClinicalTrial) StateType.FINANCE_PROPOSAL
        else StateType.STUDY_PROPOSAL

        nextState.roles = stateService.verifyNextStateValid(currState.id!!, nextStateId, stateType, role).toFlux()

        if(isClinicalTrial && currState.name == States.VALIDACAO_CF.name) {
            val check = validationsRepository.isPfcValidatedByProposalId(proposal.id!!).awaitSingle()
            if(!check) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O contrato financeiro ainda não foi completamente validado!")
            }
        }
        if (stateService.isTerminalState(nextStateId, stateType)) {
            if (isClinicalTrial) {
                val fullyValidated = validationsRepository.isPfcFullyValidated(proposal.financialComponent!!.id!!).awaitSingle()
                if (!fullyValidated)
                    throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "O contrato financeiro ainda não foi completamente validado!"
                    )
            }
            createResearch(proposal, isClinicalTrial)
            notifyTeam(proposal.id!!,
                NotificationModel(
                    title = if (isClinicalTrial) "Ensaio Clínico criado!" else "Estudo observacional criado!",
                    description = "A proposta com a sigla ${proposal.sigla} foi validada!\n" +
                            "Como tal, o ${if (isClinicalTrial) "ensaio clínico" else "estudo observacional"} foi criado" +
                            " com sucesso, visita a página para preencheres os detalhes!",
                    notificationType = NotificationType.RESEARCH_DETAILS,
                    ids = convertToJson(listOf(Pair("researchId", proposal.researchId!!)))
                )
            )
        }

        if(proposal.timelineEvents != null) {
            updateTimelineEvent(proposal.timelineEvents!!, nextState.name!!)
        }

        stateTransitionService.newTransition(proposal.stateId!!, nextState.id!!, stateType, proposal.id!!)

        if(nextState.stateFlowType !== StateFlowType.TERMINAL) {
            notifyTeam(proposal.id!!,
                NotificationModel(
                    title = "Progresso no estado de Proposta",
                    description = "Proposta com sigla ${proposal.sigla!!} avançou para o estado ${nextState.name!!}",
                    notificationType = NotificationType.PROPOSAL_DETAILS,
                    ids = convertToJson(listOf(Pair("proposalId", proposal.id!!))),
                    viewed = false
                )
            )
        }

        proposal.stateId = nextState.id
        proposal.state = nextState
        return proposalRepository.save(proposal).awaitSingle()
    }

    private suspend fun notifyTeam(pId: Int, notification: NotificationModel) {
        val notifications = investigationTeamService.findTeamByProposalId(pId)
            .map {
                NotificationModel(
                    userId = it.memberId!!,
                    title = notification.title,
                    description = notification.description,
                    notificationType = notification.notificationType,
                    ids = notification.ids,
                    viewed = false
                )
            }
        notificationService.createBulkNotifications(notifications)
    }

    @Transactional
    override suspend fun validatePfc(
        proposalId: Int,
        pfcId: Int,
        validationComment: ValidationComment
    ): ProposalValidationModel {
        val wasValid = validationsRepository.isPfcValidatedByPfcId(pfcId).awaitSingle()
        if(wasValid) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O componente financeiro já está validado!")
        val c = commentsService.createComment(validationComment.comment!!)
        validationComment.comment = c
        val res = proposalFinancialService.validate(pfcId, validationComment)
        val isNowValidated = validationsRepository.isPfcValidatedByPfcId(pfcId).awaitSingle()
        val proposal: ProposalModel = getProposalById(proposalId, false)
        if(isNowValidated && proposal.state!!.name == States.VALIDACAO_CF.name) {
            val nextState = stateService.getNextProposalState(proposalId, StateType.FINANCE_PROPOSAL)
            handleStateTransition(proposal, nextState.id!!, listOf(Roles.SUPERUSER.name))
        }
        loadSideDetails(proposal)
        return ProposalValidationModel(proposal, res)
    }

    /**
     * Load validations, transitions, comments and protocol for proposal
     */
    private suspend fun loadSideDetails(proposal: ProposalModel) {
        proposal.financialComponent = proposalFinancialService.findComponentByProposalId(proposal.id!!, true)
        val type = if(proposal.type === ResearchType.CLINICAL_TRIAL) StateType.FINANCE_PROPOSAL else StateType.STUDY_PROPOSAL
        proposal.stateTransitions = stateTransitionService.findAllByRefId(proposal.id!!, type)
        proposal.comments = commentsService.getComments(proposal.id!!, PageRequest.of(0, 20, Sort.by("date_created")))
    }

    private suspend fun createResearch(proposal: ProposalModel, isClinicalTrial: Boolean) {
        val stateAtivo = stateService.findInitialStateByType(StateType.RESEARCH)
        var researchModel = ResearchModel(proposalId = proposal.id, stateId = stateAtivo.id, type = proposal.type)
        researchModel = researchService.createResearch(researchModel, isClinicalTrial)
        proposalResearchRepository
            .save(ProposalResearch(proposalId = proposal.id, researchId = researchModel.id))
            .awaitSingle()
        proposal.researchId = researchModel.id!!
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

    private suspend fun updateTimelineEvent(
        timelineEvents: Flux<TimelineEventModel>,
        state: String
    ) {
        val completedEvents =
                timelineEvents
                    .filter(filterEventsByState(state))
                    .map (this::setEventCompleted)
                    .map (this::setOverDueDays)
                    .collectList()
                    .awaitSingle()

        if(completedEvents.isNotEmpty())
            timelineEventRepository.saveAll(completedEvents).subscribe()

        completedEvents.forEach {
            notifyTeam(it.proposalId!!,
                NotificationModel(
                    title = "Evento ${it.eventName} foi completo!",
                    description = "O evento ${it.eventName} foi marcado como completo na data ${it.completedDate}",
                    notificationType = NotificationType.PROPOSAL_EVENTS,
                    ids = convertToJson(listOf(Pair("proposalId", it.proposalId!!)))
                ))
        }
    }

    private suspend fun loadDetails(prop: ProposalModel): ProposalModel {
        prop.investigationTeam = investigationTeamService.findTeamByProposalId(prop.id!!)

        val type = if(prop.type === ResearchType.CLINICAL_TRIAL) StateType.FINANCE_PROPOSAL
        else StateType.STUDY_PROPOSAL

        prop.stateTransitions = stateTransitionService.findAllByRefId(prop.id!!, type)

        val page = PageRequest.of(0, 20, Sort.by("date_created"))
        prop.comments = commentsService.getComments(prop.id!!, page)

        prop.timelineEvents = timelineEventRepository.findTimelineEventsByProposalId(prop.id!!)

        if(prop.type == ResearchType.CLINICAL_TRIAL) {
            prop.financialComponent!!.partnerships = partnershipService
                .findAllByProposalFinancialComponentId(prop.financialComponent!!.id!!)

            prop.financialComponent!!.validations = validationsRepository
                .findAllByPfcId(prop.financialComponent!!.id!!)
        }

//        prop.files =
        return prop
    }
}

