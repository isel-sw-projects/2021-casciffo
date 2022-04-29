package isel.casciffo.casciffospringbackend.research.visits

import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigatorsRepository
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigatorsService
import isel.casciffo.casciffospringbackend.users.UserRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class VisitServiceImpl(
    @Autowired val visitRepository: VisitRepository,
    @Autowired val visitInvestigatorsRepository: VisitInvestigatorsRepository,
    @Autowired val visitInvestigatorsService: VisitInvestigatorsService
) : VisitService {

    @Transactional
    override suspend fun createVisit(visit: Visit): Visit {
        if(visit.visitInvestigators == null) throw IllegalArgumentException("A visit must have assigned investigators!!!")
        if(visit.participantId == null) throw IllegalArgumentException("Participant Id must not be null!!!")
        visitInvestigatorsRepository.saveAll(visit.visitInvestigators!!)

        return visitRepository.save(visit).awaitSingle()
    }

    @Transactional
    override suspend fun updateVisit(visit: Visit): Visit {
        if(visit.visitInvestigators == null) throw IllegalArgumentException("A visit must have assigned investigators!")
        visitInvestigatorsRepository.saveAll(visit.visitInvestigators!!)
        return visitRepository.save(visit).awaitSingle()
    }

    override suspend fun getVisitsForPatient(researchId: Int, participantId: Int): Flow<Visit> {
        return visitRepository.findAllByParticipantIdAndResearchId(researchId, participantId).asFlow()
    }

    override suspend fun getVisitsForResearch(researchId: Int): Flow<Visit> {
        return visitRepository.findAllByResearchId(researchId).asFlow().map(this::loadAssignedInvestigators)
    }

    suspend fun loadAssignedInvestigators(visit: Visit): Visit {
        visit.visitInvestigators =
            visitInvestigatorsService
                .findAllByVisitId(visit.id!!).asFlux()

        return visit
    }
}
