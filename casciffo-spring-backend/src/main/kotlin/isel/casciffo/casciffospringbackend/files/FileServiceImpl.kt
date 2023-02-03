package isel.casciffo.casciffospringbackend.files

import kotlinx.coroutines.flow.Flow
import org.springframework.stereotype.Service

@Service
class FileServiceImpl : FileService{
    override suspend fun createFile(file: FileInfo): FileInfo {
        TODO("Not yet implemented")
    }

    override suspend fun deleteFile(fileId: Int): FileInfo {
        TODO("Not yet implemented")
    }

    override suspend fun getFilesByProposalId(pId: Int): Flow<FileInfo> {
        TODO("Not yet implemented")
    }

    override suspend fun associateFileToProposal(fId: Int, pId: Int) {
        TODO("Not yet implemented")
    }

    override suspend fun disassociateFileFromProposal(fId: Int, pId: Int) {
        TODO("Not yet implemented")
    }
}