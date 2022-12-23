package isel.casciffo.casciffospringbackend.proposal_research

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("proposal_research")
data class ProposalResearch(
    @Id
    var id: Int? = null,
    var proposalId: Int? = null,
    var researchId: Int? = null
)
