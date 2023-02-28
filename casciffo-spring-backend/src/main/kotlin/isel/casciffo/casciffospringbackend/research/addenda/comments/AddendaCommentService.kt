package isel.casciffo.casciffospringbackend.research.addenda.comments

import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux

interface AddendaCommentService {
    suspend fun createComment(addendaComment: AddendaComment): AddendaComment

    suspend fun deleteComment(addendaCommentId: Int)

    suspend fun findAllCommentsByAddendaId(addendaId: Int): Flow<AddendaComment>
}