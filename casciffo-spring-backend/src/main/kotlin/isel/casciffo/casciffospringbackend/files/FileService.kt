package isel.casciffo.casciffospringbackend.files

import kotlinx.coroutines.flow.Flow

interface FileService {
    suspend fun createFile(file: FileInfo): FileInfo
    suspend fun deleteFile(fileId: Int): FileInfo
    suspend fun getFilesByProposalId(pId: Int): Flow<FileInfo>
    suspend fun associateFileToProposal(fId: Int, pId: Int)
    suspend fun disassociateFileFromProposal(fId: Int, pId: Int)
}