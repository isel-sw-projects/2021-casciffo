package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.aggregates.visits.ResearchVisitsAggregate
import isel.casciffo.casciffospringbackend.aggregates.visits.ResearchVisitsAggregateRepo
import isel.casciffo.casciffospringbackend.common.VisitPeriodicity
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.patients.ParticipantService
import isel.casciffo.casciffospringbackend.research.patients.PatientModel
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigators
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigatorsRepository
import isel.casciffo.casciffospringbackend.research.visits.investigators.VisitInvestigatorsService
import isel.casciffo.casciffospringbackend.users.user.UserModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import mu.KLogger
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@Service
class VisitServiceImpl(
    @Autowired val visitRepository: VisitRepository,
    @Autowired val visitInvestigatorsRepository: VisitInvestigatorsRepository,
    @Autowired val visitInvestigatorsService: VisitInvestigatorsService,
    @Autowired val visitsAggregateRepo: ResearchVisitsAggregateRepo,
    @Autowired val visitMapper: Mapper<VisitModel, VisitDTO>,
    @Autowired val participantService: ParticipantService
) : VisitService {

    val logger : KLogger = KotlinLogging.logger {  }

    @Transactional
    override suspend fun createVisit(visit: VisitDTO): VisitModel {
        if(visit.visitInvestigators == null) throw IllegalArgumentException("A visit must have assigned investigators!!!")
        if(visit.researchPatientId == null) throw IllegalArgumentException("Participant Id must not be null!!!")

        val model = visitMapper.mapDTOtoModel(visit)
        val createdVisit = visitRepository.save(model).awaitSingle()

        val visitInvestigators = visit
            .visitInvestigators!!
            .map {
                it.id = null
                it.visitId = createdVisit.id!!
                it
            }
        createdVisit.visitInvestigators = visitInvestigatorsRepository
            .saveAll(visitInvestigators)
            .collectList()
            .awaitSingle()
            .asFlow()

        createdVisit.researchPatient = visit.researchPatient

        return createdVisit
    }

    override suspend fun addPatientWithVisits(researchId: Int, patientWithVisitsDTO: PatientWithVisitsDTO): PatientWithVisitsModel {
        //small caveat is if participant doesn't exist needs to be addressed

        if(patientWithVisitsDTO.patient == null)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Paciente não pode vir null!!!")

        val participant = participantService.addParticipantToResearch(patientWithVisitsDTO.patient.id!!, researchId)
        participant.patient = patientWithVisitsDTO.patient

        if(patientWithVisitsDTO.scheduledVisits.isNullOrEmpty())
            return PatientWithVisitsModel(researchPatient = participant)

        patientWithVisitsDTO.scheduledVisits.forEach {
            it.researchPatientId = participant.id!!
            it.researchPatient = participant
            it.researchId = researchId
        }
        val visits = scheduleVisits(researchId, patientWithVisitsDTO.scheduledVisits)
        return PatientWithVisitsModel(researchPatient = participant, visits = visits)
    }

    @Transactional
    override suspend fun concludeVisit(visit: VisitModel): VisitModel {
        val existingVisit = visitRepository.findById(visit.id!!).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "A visit com id ${visit.id} não existe.")
        if(existingVisit.concluded == true) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Uma visita concluída não pode ser alterada.")
        }
        visit.concluded = true
        return visitRepository.save(visit)
            .map {
                it.visitInvestigators = visit.visitInvestigators
                it
            }.awaitSingle()
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
            researchPatientId = firstEntry.researchPatientId,
            hasAdverseEventAlert = firstEntry.hasAdverseEventAlert,
            hasMarkedAttendance = firstEntry.hasMarkedAttendance,
            observations = firstEntry.observations,
            periodicity = firstEntry.periodicity,
            customPeriodicity = firstEntry.customPeriodicity,
            scheduledDate = firstEntry.scheduledDate,
            concluded = firstEntry.concluded,
            researchPatient = ResearchPatient(
                id = firstEntry.researchPatientId,
                treatmentBranch = firstEntry.treatmentBranch,
                joinDate = firstEntry.joinDate,
                patient = PatientModel(
                    age = firstEntry.age,
                    gender = firstEntry.gender,
                    fullName = firstEntry.fullName,
                    processId = firstEntry.processId
                )
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

    override suspend fun scheduleVisits(researchId: Int, visits: List<VisitDTO>): Flow<VisitModel> {
        return visits.flatMap {
            if(it.visitInvestigators == null || it.visitInvestigators!!.isEmpty())
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Uma visita tem de ter obrigatóriamente pelo menos um investigador associado.")

            if(it.researchPatientId == null)
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Uma visita tem de ter obrigatóriamente um paciente")

            val mutableList = mutableListOf<VisitModel>()
            if(it.periodicity === VisitPeriodicity.NONE) {
                val visit = createVisit(it)
                mutableList.add(visit)
                return@flatMap mutableList
            }
            if (it.startDate == null || it.endDate == null || it.startDate!!.isEqual(it.endDate)) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Parameter start date and end date are incorrect!" +
                    "\nStart date must always be greater than end date!"
                )
            }
            var currDate = it.startDate!!
            val timeStep : (date: LocalDateTime) -> LocalDateTime =
                when (it.periodicity) {
                    VisitPeriodicity.DAILY -> {date -> date.plusDays(1)}
                    VisitPeriodicity.WEEKLY -> {date -> date.plusWeeks(1)}
                    VisitPeriodicity.MONTHLY -> {date -> date.plusMonths(1)}
                    VisitPeriodicity.CUSTOM -> {date -> date.plusDays(it.customPeriodicity!!.toLong())}
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Periodicity of visit isn't what's expected! Current value: ${it.periodicity}")
            }

            while (currDate.isBefore(it.endDate!!)) {
                //id must be set to null for creation and not update
                it.id = null
                //each iteration is a new visit, where only the scheduled date needs to be updated
                it.scheduledDate = currDate
                val visit = createVisit(it)
                mutableList.add(visit)
                currDate = timeStep(currDate)
            }

            mutableList
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
