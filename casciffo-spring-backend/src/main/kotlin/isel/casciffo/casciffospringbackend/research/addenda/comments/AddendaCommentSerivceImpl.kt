package isel.casciffo.casciffospringbackend.research.addenda.comments


import isel.casciffo.casciffospringbackend.users.user.UserModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

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

    override suspend fun findAllCommentsByAddendaId(addendaId: Int): Flow<AddendaComment> {
        return addendaCommentRepository.findAllCommentsByAddendaId(addendaId).flatMap {
            Mono.just(AddendaComment(
                id = it.id!!,
                createdDate = it.createdDate!!,
                addendaId = it.addendaId!!,
                observation = it.observation!!,
                authorId = it.authorId!!,
                authorName = it.authorName!!,
                author = UserModel(userId = it.authorId!!, name = it.authorName!!)
            ))
        }.asFlow()
    }
}