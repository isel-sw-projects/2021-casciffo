package isel.casciffo.casciffospringbackend.research.addenda.comments


import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

@Service
class AddendaCommentSerivceImpl(
    @Autowired val addendaCommentRepository: AddendaCommentRepository
): AddendaCommentService {
    override suspend fun createComment(addendaComment: AddendaComment): AddendaComment {
        return addendaCommentRepository.save(addendaComment).awaitSingle()
    }

    override suspend fun deleteComment(addendaCommentId: Int) {
        addendaCommentRepository.deleteById(addendaCommentId).awaitSingle()
    }

    override suspend fun findAllCommentsByAddendaId(addendaId: Int): Flux<AddendaComment> {
        return addendaCommentRepository.findAllCommentsByAddendaId(addendaId)
    }
}