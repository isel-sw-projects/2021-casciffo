package isel.casciffo.casciffospringbackend.validations

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComment

data class ValidationComment(
    var newValidation: Boolean?= null,
    var validation: Validation?=null,
    var comment: ProposalComment?=null
)
