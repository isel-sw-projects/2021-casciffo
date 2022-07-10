package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.validations.ValidationComment

data class ProposalValidationModel(
    var proposal: ProposalModel?=null,
    var validation: ValidationComment?=null
)
