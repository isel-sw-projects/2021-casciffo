package isel.casciffo.casciffospringbackend.research

import isel.casciffo.casciffospringbackend.proposals.ProposalService
import isel.casciffo.casciffospringbackend.proposals.ResearchType
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.AddendaService
import isel.casciffo.casciffospringbackend.research.finance.ResearchFinanceService
import isel.casciffo.casciffospringbackend.research.patients.ParticipantService
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivities
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivitiesRepository
import isel.casciffo.casciffospringbackend.states.StateRepository
import isel.casciffo.casciffospringbackend.states.transitions.TransitionType
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionRepository
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ResearchServiceImpl(
    @Autowired val researchFinanceService: ResearchFinanceService,
    @Autowired val scientificActivitiesRepository: ScientificActivitiesRepository,
    @Autowired val addendaService: AddendaService,
    @Autowired val stateRepository: StateRepository,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val researchRepository: ResearchRepository,
//    @Autowired val proposalService: ProposalService,
    @Autowired val participantService: ParticipantService
): ResearchService {

    override suspend fun getAllResearchesByType(type: ResearchType): Flow<Research> {
        return researchRepository.findAllByType(type).asFlow().map(this::loadRelations)
    }

    override suspend fun getResearch(researchId: Int): Research {
        val research = researchRepository.findById(researchId).awaitFirstOrNull()
            ?: throw IllegalArgumentException("research Id doesnt exist!!!")
        return loadRelations(research, true)
    }

    @Transactional
    override suspend fun createResearch(research: Research): Research {
        return researchRepository.save(research).awaitFirst()
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
    override suspend fun updateResearch(research: Research): Research {
        val existingResearch = researchRepository.findById(research.id!!).awaitFirstOrNull()
            ?: throw IllegalArgumentException("Research doesnt exist!!!")
        val hasStateTransitioned = research.stateId == existingResearch.stateId

        if(hasStateTransitioned) {
            stateTransitionService
                .newTransition(existingResearch.stateId!!, research.stateId!!, TransitionType.RESEARCH, research.id!!)
        }
        return researchRepository.save(research).awaitFirstOrNull() ?: throw Exception("Idk what happened bro ngl")
    }

    suspend fun loadRelations(research: Research, isDetailedView: Boolean = false) : Research {
        //research.proposal = proposalService.getProposalById(research.proposalId!!)

        if(isDetailedView) {
            research.stateTransitions = stateTransitionService.findAllByReferenceId(research.id!!)
            research.participants = participantService.getParticipantsByResearchId(research.id!!)
        }

        return research
    }
}