package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchAggregate
import isel.casciffo.casciffospringbackend.common.CountHolder
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivity
import isel.casciffo.casciffospringbackend.research.visits.visits.PatientWithVisitsDTO
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitModel
import isel.casciffo.casciffospringbackend.statistics.ResearchStats
import kotlinx.coroutines.flow.Flow
import org.springframework.data.domain.PageRequest

interface ResearchService {

    suspend fun getResearchCount(): CountHolder
    suspend fun createResearch(researchModel: ResearchModel, withFinance: Boolean = false) : ResearchModel
    suspend fun getLatestModifiedResearch(n: Int): Flow<ResearchAggregate>
    suspend fun getAllResearchesByType(type: ResearchType, pageRequest: PageRequest? = null): Flow<ResearchAggregate>
    suspend fun getResearch(researchId: Int, loadDetails: Boolean = true): ResearchModel
    suspend fun updateResearch(researchModel: ResearchModel) : ResearchModel
    suspend fun createStudy(study: ScientificActivity) : ScientificActivity
    suspend fun addParticipant(researchId: Int, participantId: Int)
    suspend fun createAddenda(addenda: Addenda) : Addenda
    suspend fun createAddendaComment(addendaId: Int, commentBody: AddendaComment): AddendaComment
    suspend fun getAddenda(researchId: Int, addendaId: Int): Addenda
    suspend fun cancelResearch(researchId: Int, reason: String, userId: Int): Boolean
    suspend fun completeResearch(researchId: Int): Boolean
    suspend fun randomizeTreatmentBranches(researchId: Int, patients: List<ResearchPatient>): Flow<ResearchPatient>
    suspend fun getResearchStats(): Flow<ResearchStats>
    suspend fun removeParticipant(researchId: Int, patientProcessNum: Int)
}