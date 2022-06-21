package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import java.util.Date

data class ProtocolDTO(
    var id: Int? = null,
    var validatedDate: Date? = null,
    var isValidated: Boolean = false,
    var financialComponentId: Int?=null,
    var comments: List<ProtocolComments>? = null
)