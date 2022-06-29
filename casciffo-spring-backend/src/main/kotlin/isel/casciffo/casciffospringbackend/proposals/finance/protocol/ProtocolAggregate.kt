package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComment

data class ProtocolAggregate(
    val proposalProtocol: ProposalProtocol? = null,
    val comment: ProposalComment? = null,
    val newValidation: Boolean? = null
)
