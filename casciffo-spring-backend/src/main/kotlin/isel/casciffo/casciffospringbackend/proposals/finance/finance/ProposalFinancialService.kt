package isel.casciffo.casciffospringbackend.proposals.finance.finance

import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.validations.ValidationComment
import kotlinx.coroutines.flow.Flow
import org.springframework.http.codec.multipart.FilePart
import java.io.File
import java.nio.file.Path

interface ProposalFinancialService {
    suspend fun createProposalFinanceComponent(pfc: ProposalFinancialComponent) : ProposalFinancialComponent
    suspend fun findComponentByProposalId(pid: Int, loadProtocol: Boolean = false) : ProposalFinancialComponent

    suspend fun createCF(file: FilePart, pfcId: Int): FileInfo

    suspend fun getCF(pfcId: Int): Path

    suspend fun validate(pfcId: Int, validationComment: ValidationComment): ValidationComment
    suspend fun findAll(): Flow<ProposalFinancialComponent>
    suspend fun isValidated(pfcId: Int): Boolean
}