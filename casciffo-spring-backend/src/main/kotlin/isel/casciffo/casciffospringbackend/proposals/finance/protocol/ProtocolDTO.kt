package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComments
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.comments.ProtocolComments
import java.time.LocalDateTime

data class ProtocolDTO(
    var id: Int? = null,
    var validatedDate: LocalDateTime? = null,
    var isValidated: Boolean? = null,
    var financialComponentId: Int?=null,
)