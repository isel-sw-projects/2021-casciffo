package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import java.time.LocalDateTime
import java.util.Date

data class ProtocolDTO(
    var id: Int? = null,
    var validatedDate: LocalDateTime? = null,
    var isValidated: Boolean = false,
    var financialComponentId: Int?=null,
    var comments: List<ProtocolComments>? = null
)