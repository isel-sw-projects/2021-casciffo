package isel.casciffo.casciffospringbackend.research.addenda.comments

import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class AddendaCommentController(
    @Autowired val service: AddendaCommentService
) {

    suspend fun createComment(addendaId: Int, addendaComment: AddendaComment): ResponseEntity<AddendaComment> {
        TODO("Not yet moved from research controller")
    }

    suspend fun deleteComment(addendaId: Int, commentId: Int): ResponseEntity<Void> {
        TODO("Not yet moved from research controller")
    }

    suspend fun getComments(addendaId: Int): Flow<AddendaComment> {
        TODO("Not yet moved from research controller")
    }
}