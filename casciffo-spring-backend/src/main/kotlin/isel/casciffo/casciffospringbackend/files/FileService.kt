package isel.casciffo.casciffospringbackend.files

import kotlinx.coroutines.flow.Flow
import org.springframework.http.codec.multipart.FilePart

interface FileService {
    suspend fun createFile(file: FilePart): FileInfo
    suspend fun deleteFile(fileId: Int): FileInfo
    suspend fun getFilesByProposalId(pId: Int): Flow<FileInfo>
    suspend fun associateFileToProposal(fId: Int, pId: Int)
    suspend fun disassociateFileFromProposal(fId: Int, pId: Int)
    suspend fun getFileByAddendaId(addendaId: Int): FileInfo
}