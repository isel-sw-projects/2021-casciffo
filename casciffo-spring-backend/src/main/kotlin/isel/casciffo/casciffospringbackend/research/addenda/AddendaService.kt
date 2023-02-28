package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.server.reactive.ServerHttpRequest
import reactor.core.publisher.Flux
import java.nio.file.Path


interface AddendaService {
    suspend fun createAddenda(researchId: Int, addendaFile: FilePart?) : Addenda
    suspend fun updateAddenda(addenda: Addenda) : Addenda
    suspend fun getAddendaByResearchId(researchId: Int) : Flux<Addenda>
    suspend fun transitionState(addendaId: Int, nextStateId: Int, request: ServerHttpRequest): Addenda
    suspend fun cancelAddenda(addendaId: Int, researchId: Int, request: ServerHttpRequest): Addenda
    suspend fun getAddendaDetails(addendaId: Int, loadLists: Boolean = true): Addenda
    suspend fun getAddendaFile(addendaId: Int, researchId: Int): Path

    suspend fun createAddendaComment(addendaId: Int, comment: AddendaComment): AddendaComment
}