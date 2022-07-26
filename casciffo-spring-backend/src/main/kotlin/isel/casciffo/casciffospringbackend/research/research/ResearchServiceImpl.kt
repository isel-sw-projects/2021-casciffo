package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregateRepo
import isel.casciffo.casciffospringbackend.aggregates.research.ResearchDetailAggregate
import isel.casciffo.casciffospringbackend.aggregates.research.ResearchDetailAggregateRepo
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.AddendaService
import isel.casciffo.casciffospringbackend.research.finance.clinical_trial.ResearchFinanceService
import isel.casciffo.casciffospringbackend.research.patients.ParticipantService
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivities
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivitiesRepository
import isel.casciffo.casciffospringbackend.states.state.StateRepository
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.asFlux
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ResearchServiceImpl(
    @Autowired val researchFinanceService: ResearchFinanceService,
    @Autowired val scientificActivitiesRepository: ScientificActivitiesRepository,
    @Autowired val addendaService: AddendaService,
    @Autowired val stateRepository: StateRepository,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val researchRepository: ResearchRepository,
    @Autowired val generalResearchAggregate: ResearchAggregateRepo,
    @Autowired val detailResearchAggregate: ResearchDetailAggregateRepo,
//    @Autowired val proposalService: ProposalService,
    @Autowired val participantService: ParticipantService,
    @Autowired val generalMapper: Mapper<ResearchModel, ResearchAggregate>,
    @Autowired val detailMapper: Mapper<ResearchModel, ResearchDetailAggregate>
): ResearchService {

    override suspend fun getAllResearchesByType(type: ResearchType): Flow<ResearchAggregate> {
        return generalResearchAggregate.findAllByType(type).asFlow()
    }

    override suspend fun getResearch(researchId: Int): ResearchModel {
        val research = researchRepository.findById(researchId).awaitFirstOrNull()
            ?: throw IllegalArgumentException("research Id doesnt exist!!!")
        return loadRelations(research, true)
    }

    @Transactional
    override suspend fun createResearch(researchModel: ResearchModel): ResearchModel {
        return researchRepository.save(researchModel).awaitFirst()
    }

    @Transactional
    override suspend fun createStudy(study: ScientificActivities) : ScientificActivities {
        return scientificActivitiesRepository.save(study).awaitFirst()
    }

    override suspend fun getResearchStudies(researchId: Int): Flow<ScientificActivities> {
        return scientificActivitiesRepository.findAllByResearchId(researchId).asFlow()
    }

    override suspend fun addParticipant(researchId: Int, participantId: Int) {
        participantService.addParticipantToResearch(researchId = researchId, participantId =  participantId)
    }

    @Transactional
    override suspend fun createAddenda(addenda: Addenda) : Addenda = addendaService.createAddenda(addenda)

    @Transactional
    override suspend fun updateResearch(researchModel: ResearchModel): ResearchModel {
        val existingResearch = researchRepository.findById(researchModel.id!!).awaitFirstOrNull()
            ?: throw IllegalArgumentException("Research doesnt exist!!!")
        val hasStateTransitioned = researchModel.stateId == existingResearch.stateId

        if(hasStateTransitioned) {
            stateTransitionService
                .newTransition(existingResearch.stateId!!, researchModel.stateId!!, StateType.RESEARCH, researchModel.id!!)
        }
        return researchRepository.save(researchModel).awaitFirstOrNull() ?: throw Exception("Idk what happened bro ngl")
    }

    suspend fun loadRelations(researchModel: ResearchModel, isDetailedView: Boolean = false) : ResearchModel {

        if(isDetailedView) {
            researchModel.stateTransitions = stateTransitionService.findAllByReferenceId(researchModel.id!!, StateType.RESEARCH).asFlux()
            researchModel.participants = participantService.getParticipantsByResearchId(researchModel.id!!).asFlux()
        }

        return researchModel
    }
}