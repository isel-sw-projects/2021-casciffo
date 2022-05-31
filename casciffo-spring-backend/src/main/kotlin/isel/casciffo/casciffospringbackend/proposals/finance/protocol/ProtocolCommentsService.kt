package isel.casciffo.casciffospringbackend.proposals.finance.protocol

interface ProtocolCommentsService {
    suspend fun saveComment(comment: ProtocolComments): ProtocolComments
}