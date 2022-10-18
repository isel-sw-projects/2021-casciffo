package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatients
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivity
import isel.casciffo.casciffospringbackend.research.visits.visits.PatientWithVisitsDTO
import isel.casciffo.casciffospringbackend.research.visits.visits.PatientWithVisitsModel
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitDTO
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitModel
import kotlinx.coroutines.flow.Flow

interface ResearchService {
    suspend fun createResearch(researchModel: ResearchModel, withFinance: Boolean = false) : ResearchModel
    suspend fun getAllResearchesByType(type: ResearchType): Flow<ResearchAggregate>
    suspend fun getResearch(researchId: Int, loadDetails: Boolean = true): ResearchModel
    suspend fun updateResearch(researchModel: ResearchModel) : ResearchModel
    suspend fun createStudy(study: ScientificActivity) : ScientificActivity
    suspend fun addParticipant(researchId: Int, participantId: Int)
    suspend fun addPatientWithVisits(researchId: Int, patientWithVisitsDTO: PatientWithVisitsDTO): Flow<VisitModel>
    suspend fun createAddenda(addenda: Addenda) : Addenda
    suspend fun createAddendaComment(addendaId: Int, commentBody: AddendaComment): AddendaComment
    suspend fun getAddenda(researchId: Int, addendaId: Int): Addenda
    suspend fun cancelResearch(researchId: Int, reason: String, userId: Int): Boolean
    suspend fun completeResearch(researchId: Int): Boolean
    suspend fun randomizeTreatmentBranches(patients: List<ResearchPatients>): Flow<ResearchPatients>
}