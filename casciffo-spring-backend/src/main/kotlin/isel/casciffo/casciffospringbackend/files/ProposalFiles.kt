package isel.casciffo.casciffospringbackend.files

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("proposal_files")
data class ProposalFiles (
    @Id
    @Column("id")
    var id: Int?,

    var proposalId: Int?,

    var fileId: Int?
)