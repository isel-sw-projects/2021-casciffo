package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.promoter.Promoter
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolDTO


data class ProposalFinancialComponentDTO(
    var id : Int? = null,
    var proposalId: Int? = null,
    var promoterId: Int? = null,
    var financialContractId: Int? = null,
    var promoter: Promoter? = null,
    var partnerships: List<Partnership>? = null,
    var protocol: ProtocolDTO? = null
)