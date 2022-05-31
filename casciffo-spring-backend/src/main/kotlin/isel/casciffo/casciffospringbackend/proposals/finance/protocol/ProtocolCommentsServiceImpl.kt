package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ProtocolCommentsServiceImpl(
    @Autowired val repository: ProtocolCommentsRepository
): ProtocolCommentsService {
    override suspend fun saveComment(comment: ProtocolComments): ProtocolComments {
        //fixme this is temp fix requires a look at @CreatedDate
        val savedComment = repository.save(comment).awaitSingle()
        return repository.findById(savedComment.id!!).awaitSingle()
    }
}