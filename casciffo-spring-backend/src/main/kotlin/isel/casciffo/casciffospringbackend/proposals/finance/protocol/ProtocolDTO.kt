package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import java.time.LocalDate

data class ProtocolDTO(
    var id: Int? = null,
    var validatedDate: LocalDate? = null,
    var isValidated: Boolean = false,
    var financialComponentId: Int?=null,
    var comments: List<ProtocolComments>? = null
)