package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregateRepo
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamService
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.AddendaService
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import isel.casciffo.casciffospringbackend.research.dossier.DossierService
import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.overview.ResearchFinance
import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.overview.ResearchFinanceService
import isel.casciffo.casciffospringbackend.research.patients.ParticipantService
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatients
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivity
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivitiesService
import isel.casciffo.casciffospringbackend.research.visits.visits.*
import isel.casciffo.casciffospringbackend.states.state.StateService
import isel.casciffo.casciffospringbackend.states.state.States
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class ResearchServiceImpl(
    @Autowired val researchFinanceService: ResearchFinanceService,
    @Autowired val activitiesService: ScientificActivitiesService,
    @Autowired val addendaService: AddendaService,
    @Autowired val stateService: StateService,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val researchRepository: ResearchRepository,
    @Autowired val aggregateRepo: ResearchAggregateRepo,
    @Autowired val participantService: ParticipantService,
    @Autowired val aggregateMapper: Mapper<ResearchModel, ResearchAggregate>,
    @Autowired val dossierService: DossierService,
    @Autowired val investigationTeamService: InvestigationTeamService,
    @Autowired val visitService: VisitService
): ResearchService {

    override suspend fun getAllResearchesByType(type: ResearchType): Flow<ResearchAggregate> {
        return aggregateRepo.findAllByType(type).asFlow()
    }

    override suspend fun getResearch(researchId: Int, loadDetails: Boolean): ResearchModel {
        val aggregate = aggregateRepo.findAggregateById(researchId).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "research Id doesnt exist!!!")

        val research = aggregateMapper.mapDTOtoModel(aggregate)

        return if(loadDetails) loadRelations(research)
        else research
    }

    @Transactional
    override suspend fun createResearch(researchModel: ResearchModel, withFinance: Boolean): ResearchModel {
        val research = researchRepository.save(researchModel).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Couldn't save object $researchModel")

        if(withFinance) {
            researchFinanceService.createResearchFinance(research.id!!)
        }
        return research
    }

    @Transactional
    override suspend fun createStudy(study: ScientificActivity) : ScientificActivity {
        return activitiesService.createScientificActivity(study)
    }

    override suspend fun addParticipant(researchId: Int, participantId: Int) {
        participantService.addParticipantToResearch(researchId = researchId, participantId =  participantId)
    }

    override suspend fun addPatientWithVisits(researchId: Int, patientWithVisitsDTO: PatientWithVisitsDTO): Flow<VisitModel> {

        //TODO
        // call patient service to add patient to research
        // call visit service passing patientId, researchId and the visits array
        // map ids to visitDTO or return Flow

        //small caveat is if participant doesn't exist needs to be addressed

        participantService.addParticipantToResearch(patientWithVisitsDTO.patient!!.id!!, researchId)

        return visitService.scheduleVisits(researchId, patientWithVisitsDTO.patient!!.id!!, patientWithVisitsDTO.visits!!)
    }

    override suspend fun getAddenda(researchId: Int, addendaId: Int): Addenda {
        return addendaService.getAddendaDetails(addendaId)
    }

    override suspend fun cancelResearch(researchId: Int, reason: String, userId: Int): Boolean {
        val research = getResearch(researchId, false)

        val isTerminal = stateService.isTerminalState(research.stateId!!, StateType.RESEARCH)

        if(isTerminal) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Não pode alterar um ensaio cancelado.")

        val canceledState = stateService.findByName(States.CANCELADO.name)

        createTransition(researchId, research.stateId!!, canceledState.id!!)

        research.stateId = canceledState.id
        research.state = canceledState

        research.canceledById = userId
        research.canceledReason = reason
        researchRepository.save(research).awaitSingle()
        return true
    }

    override suspend fun completeResearch(researchId: Int): Boolean {
        val research = getResearch(researchId, false)

        val isTerminal = stateService.isTerminalState(research.stateId!!, StateType.RESEARCH)

        if(isTerminal) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Não pode alterar um ensaio completo.")

        val completedState = stateService.findByName(States.COMPLETO.name)

        createTransition(researchId, research.stateId!!, completedState.id!!)

        research.stateId = completedState.id
        research.state = completedState

        researchRepository.save(research).awaitSingle()
        return true
    }

    override suspend fun randomizeTreatmentBranches(patients: List<ResearchPatients>): Flow<ResearchPatients> {
        return participantService.randomizeTreatmentBranches(patients)
    }

    private suspend fun createTransition(researchId: Int, stateId: Int, nextStateId: Int) {
        val res = stateTransitionService.newTransition(stateId, nextStateId, StateType.RESEARCH, researchId)
        if(!res) throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao transitar o ensaio $researchId do estado $stateId para $nextStateId .")
    }

    @Transactional
    override suspend fun createAddenda(addenda: Addenda) : Addenda = addendaService.createAddenda(addenda)
    override suspend fun createAddendaComment(addendaId: Int, commentBody: AddendaComment): AddendaComment {
        return addendaService.createAddendaComment(addendaId, commentBody)
    }

    @Transactional
    override suspend fun updateResearch(researchModel: ResearchModel): ResearchModel {
        researchRepository.findById(researchModel.id!!).awaitFirstOrNull()
            ?: throw IllegalArgumentException("Research doesnt exist!!!")

        return researchRepository.save(researchModel).awaitFirstOrNull() ?: throw Exception("Idk what happened bro ngl")
    }

    suspend fun loadRelations(researchModel: ResearchModel) : ResearchModel {

        researchModel.stateTransitions = stateTransitionService.findAllByRefId(researchModel.id!!, StateType.RESEARCH)
        researchModel.patients = participantService.findAllByResearchId(researchModel.id!!)
        researchModel.dossiers = dossierService.findAllByResearchId(researchModel.id!!)
        researchModel.scientificActivities = activitiesService.findAllByResearchId(researchModel.id!!)
        researchModel.investigationTeam = investigationTeamService.findTeamByProposalId(researchModel.proposalId!!).asFlow()
        researchModel.visits = visitService.getVisitsForResearch(researchModel.id!!)
        researchModel.addendas = addendaService.getAddendaByResearchId(researchModel.id!!).asFlow()
        if(researchModel.type === ResearchType.CLINICAL_TRIAL) {
            researchModel.financeComponent = researchFinanceService.getFinanceComponentByResearchId(researchModel.id!!)
        }

        return researchModel
    }
}