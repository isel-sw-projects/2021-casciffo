package isel.casciffo.casciffospringbackend.proposals.finance.protocol.comments

interface ProtocolCommentsService {
    suspend fun saveComment(comment: ProtocolComments): ProtocolComments
}