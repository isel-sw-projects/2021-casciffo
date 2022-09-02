package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.aggregates.visits.ResearchVisitsAggregate
import isel.casciffo.casciffospringbackend.aggregates.visits.ResearchVisitsAggregateRepo
import isel.casciffo.casciffospringbackend.research.patients.PatientModel
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigators
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigatorsRepository
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigatorsService
import isel.casciffo.casciffospringbackend.users.user.UserModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingle
import mu.KLogger
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class VisitServiceImpl(
    @Autowired val visitRepository: VisitRepository,
    @Autowired val visitInvestigatorsRepository: VisitInvestigatorsRepository,
    @Autowired val visitInvestigatorsService: VisitInvestigatorsService,
    @Autowired val visitsAggregateRepo: ResearchVisitsAggregateRepo
) : VisitService {

    val logger : KLogger = KotlinLogging.logger {  }

    @Transactional
    override suspend fun createVisit(visit: VisitModel): VisitModel {
        if(visit.visitInvestigators == null) throw IllegalArgumentException("A visit must have assigned investigators!!!")
        if(visit.participantId == null) throw IllegalArgumentException("Participant Id must not be null!!!")

        val createdVisit = visitRepository.save(visit).awaitSingle()
        val visitInvestigators =
            visit
                .visitInvestigators!!
                .map {
                    it.visitId = createdVisit.id!!
                    it
                }
                .asFlux()

        visitInvestigatorsRepository.saveAll(visitInvestigators).subscribe()
        return createdVisit
    }

    @Transactional
    override suspend fun concludeVisit(visit: VisitModel): VisitModel {
        val existingVisit = visitRepository.findById(visit.id!!).awaitSingle()
        if(existingVisit.concluded!!) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Uma visita concluída não pode ser alterada.")
        }
        visit.concluded = true
        return visitRepository.save(visit).awaitSingle()
    }

    override suspend fun getVisitsForPatient(researchId: Int, participantId: Int): Flow<VisitModel> {
        return visitRepository.findAllByParticipantIdAndResearchId(researchId, participantId).asFlow()
    }

    override suspend fun getVisitsForResearch(researchId: Int): Flow<VisitModel> {
        return visitsAggregateRepo
            .findVisitsByResearchId(researchId)
            .groupBy {
                it.visitId!!
            }.flatMap { visitAggregateInfo ->
                visitAggregateInfo.collectList().map{
                    mapToVisitModel(researchId, visitAggregateInfo.key(), it)
                }
            }.asFlow()
//        return visitRepository.findAllByResearchId(researchId).asFlow().map(this::loadAssignedInvestigators)
    }

    fun mapToVisitModel(
        researchId: Int,
        visitId: Int,
        aggregateValues: List<ResearchVisitsAggregate>
    ): VisitModel {
        val firstEntry = aggregateValues[0]
        return VisitModel(
            id = visitId,
            researchId = researchId,
            visitType = firstEntry.visitType,
            participantId = firstEntry.participantId,
            endDate = firstEntry.endDate,
            startDate = firstEntry.startDate,
            hasAdverseEventAlert = firstEntry.hasAdverseEventAlert,
            hasMarkedAttendance = firstEntry.hasMarkedAttendance,
            observations = firstEntry.observations,
            periodicity = firstEntry.periodicity,
            scheduledDate = firstEntry.scheduledDate,
            patient = PatientModel(
                id = firstEntry.participantId,
                age = firstEntry.age,
                gender = firstEntry.gender,
                fullName = firstEntry.fullName,
                processId = firstEntry.processId
            ),
            visitInvestigators = aggregateValues.map { aggregateRow ->
                VisitInvestigators(
                    id = aggregateRow.visitInvestigatorId,
                    investigatorId = aggregateRow.investigatorId,
                    visitId = visitId,
                    investigator = UserModel(
                        userId = aggregateRow.investigatorId,
                        name = aggregateRow.investigatorName,
                        email = aggregateRow.investigatorEmail,
                    )
                )
            }.asFlow()
        )
    }

    override suspend fun scheduleVisits(researchId: Int, patientId: Int, visits: List<VisitModel>): Flow<VisitModel> {
        return visits.map {
            createVisit(it)
        }.asFlow()
    }

    override suspend fun getVisitDetails(researchId: Int, visitId: Int): VisitModel {
        return visitsAggregateRepo
            .findVisitDetailsByResearchAndVisitId(researchId, visitId)
            .groupBy {
                it.visitId!!
            }.flatMap { visitAggregateInfo ->
                visitAggregateInfo.collectList().map {
                    mapToVisitModel(researchId, visitId, it)
                }
            }.awaitSingle()
    }

    suspend fun loadAssignedInvestigators(visit: VisitModel): VisitModel {
        visit.visitInvestigators =
            visitInvestigatorsService
                .findAllByVisitId(visit.id!!)

        return visit
    }
}
