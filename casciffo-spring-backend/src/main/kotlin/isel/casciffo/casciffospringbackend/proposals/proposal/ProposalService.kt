package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.roles.Roles
import isel.casciffo.casciffospringbackend.validations.ValidationComment
import kotlinx.coroutines.flow.Flow

interface ProposalService {
    suspend fun getAllProposals(type: ResearchType): Flow<ProposalModel>
    suspend fun getProposalById(id: Int, loadDetails: Boolean = true): ProposalModel
    suspend fun create(proposal: ProposalModel) : ProposalModel
    suspend fun updateProposal(proposal: ProposalModel) : ProposalModel
    suspend fun deleteProposal(proposalId: Int): ProposalModel
    suspend fun transitionState(proposalId: Int, nextStateId: Int, role: Roles): ProposalModel
    suspend fun validatePfc(proposalId: Int, pfcId: Int, validationComment: ValidationComment): ProposalValidationModel
}