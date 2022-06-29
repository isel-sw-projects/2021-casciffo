package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComment

data class ProtocolAndCommentsDTO(
    var protocol: ProposalProtocol? = null,
    var comments: List<ProposalComment>? = null
)
