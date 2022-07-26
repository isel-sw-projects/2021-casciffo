package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.roles.Roles
import isel.casciffo.casciffospringbackend.validations.ValidationComment
import kotlinx.coroutines.flow.Flow
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.server.reactive.ServerHttpRequest
import java.io.File
import java.nio.file.Path

interface ProposalService {
    suspend fun getAllProposals(type: ResearchType): Flow<ProposalModel>
    suspend fun getProposalById(id: Int, loadDetails: Boolean = true): ProposalModel
    suspend fun create(proposal: ProposalModel) : ProposalModel
    suspend fun updateProposal(proposal: ProposalModel) : ProposalModel
    suspend fun deleteProposal(proposalId: Int): ProposalModel
    suspend fun transitionState(proposalId: Int, nextStateId: Int, role: Roles): ProposalModel
    suspend fun validatePfc(proposalId: Int, pfcId: Int, validationComment: ValidationComment): ProposalValidationModel
    suspend fun uploadCF(proposalId: Int, pfcId: Int, file: FilePart?)
    suspend fun downloadCF(proposalId: Int, pfcId: Int): Path
    suspend fun transitionStateV2(proposalId: Int, nextStateId: Int, request: ServerHttpRequest): ProposalModel
}