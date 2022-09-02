package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregateRepo
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamService
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.AddendaService
import isel.casciffo.casciffospringbackend.research.dossier.DossierService
import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.ResearchFinanceService
import isel.casciffo.casciffospringbackend.research.patients.ParticipantService
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivity
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivitiesService
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitDTO
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitService
import isel.casciffo.casciffospringbackend.states.state.StateRepository
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
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
    @Autowired val stateRepository: StateRepository,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val researchRepository: ResearchRepository,
    @Autowired val aggregateRepo: ResearchAggregateRepo,
//    @Autowired val proposalService: ProposalService,
    @Autowired val participantService: ParticipantService,
    @Autowired val aggregateMapper: Mapper<ResearchModel, ResearchAggregate>,
    @Autowired val dossierService: DossierService,
    @Autowired val investigationTeamService: InvestigationTeamService,
    @Autowired val visitService: VisitService
): ResearchService {

    override suspend fun getAllResearchesByType(type: ResearchType): Flow<ResearchAggregate> {
        return aggregateRepo.findAllByType(type).asFlow()
    }

    override suspend fun getResearch(researchId: Int): ResearchModel {
        val research = aggregateRepo.findAggregateById(researchId).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "research Id doesnt exist!!!")

        return loadRelations(aggregateMapper.mapDTOtoModel(research))
    }

    @Transactional
    override suspend fun createResearch(researchModel: ResearchModel): ResearchModel {
        return researchRepository.save(researchModel).awaitFirst()
    }

    @Transactional
    override suspend fun createStudy(study: ScientificActivity) : ScientificActivity {
        return activitiesService.createScientificActivity(study)
    }

    override suspend fun addParticipant(researchId: Int, participantId: Int) {
        participantService.addParticipantToResearch(researchId = researchId, participantId =  participantId)
    }

    override suspend fun addPatientWithVisits(researchId: Int, visitDTO: VisitDTO): VisitDTO {

        //TODO
        // call patient service to add patient to research
        // call visit service passing patientId, researchId and the visits array
        // map ids to visitDTO or return Flow

        return visitDTO
    }

    @Transactional
    override suspend fun createAddenda(addenda: Addenda) : Addenda = addendaService.createAddenda(addenda)

    @Transactional
    override suspend fun updateResearch(researchModel: ResearchModel): ResearchModel {
        val existingResearch = researchRepository.findById(researchModel.id!!).awaitFirstOrNull()
            ?: throw IllegalArgumentException("Research doesnt exist!!!")
        val hasStateTransitioned = researchModel.stateId == existingResearch.stateId

        //TODO TO REMOVE THIS BLOCK AND MOVE IT OUTSIDE TO A COMPLETE/CANCEL/TRANSITION METHOD
        if(hasStateTransitioned) {
            stateTransitionService
                .newTransition(existingResearch.stateId!!, researchModel.stateId!!, StateType.RESEARCH, researchModel.id!!)
        }
        return researchRepository.save(researchModel).awaitFirstOrNull() ?: throw Exception("Idk what happened bro ngl")
    }

    suspend fun loadRelations(researchModel: ResearchModel) : ResearchModel {

        researchModel.stateTransitions = stateTransitionService.findAllByRefId(researchModel.id!!, StateType.RESEARCH)
        researchModel.patients = participantService.findAllByResearchId(researchModel.id!!)
        researchModel.dossiers = dossierService.findAllByResearchId(researchModel.id!!)
        researchModel.scientificActivities = activitiesService.findAllByResearchId(researchModel.id!!)
        researchModel.investigationTeam = investigationTeamService.findTeamByProposalId(researchModel.proposalId!!).asFlow()
        researchModel.visits = visitService.getVisitsForResearch(researchModel.id!!)
        return researchModel
    }
}