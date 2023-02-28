package isel.casciffo.casciffospringbackend.files

import isel.casciffo.casciffospringbackend.common.FILES_DIR
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import kotlin.io.path.fileSize
import kotlin.io.path.name
import kotlin.io.path.pathString

@Service
class FileServiceImpl(
    @Autowired val repository: FileInfoRepository
) : FileService {
    override suspend fun createFile(file: FilePart): FileInfo {
        val path = FILES_DIR(file.filename())
        val getFileInfo = { FileInfo(fileName = path.name, filePath = path.pathString, fileSize = path.fileSize()) }
        //store file locally
        file.transferTo(path).awaitSingleOrNull()
        //save file information in db
        return repository.save(getFileInfo()).awaitSingle()
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

    override suspend fun getFileByAddendaId(addendaId: Int): FileInfo {
        return repository.findByAddendaId(addendaId).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Ficheiro de adenda não encontrado.")
    }
}