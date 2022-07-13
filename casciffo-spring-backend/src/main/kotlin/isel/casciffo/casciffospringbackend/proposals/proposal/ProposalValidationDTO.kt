package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.validations.ValidationComment

data class ProposalValidationDTO(
    var proposal: ProposalDTO?=null,
    var validation: ValidationComment?=null
)
