package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsDTO
import java.time.LocalDate

data class ProtocolDTO(
    var id: Int? = null,
    var validatedDate: LocalDate? = null,
    var validated: Boolean? = null,
    var newValidation: Boolean? = null,
    var financialComponentId: Int?=null,
    var commentRef: Int?=null,
    var comment: ProposalCommentsDTO? = null
)