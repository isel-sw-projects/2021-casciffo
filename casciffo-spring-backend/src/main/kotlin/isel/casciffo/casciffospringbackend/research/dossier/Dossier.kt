package isel.casciffo.casciffospringbackend.research.dossier

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("dossier")
data class Dossier(
    @Id
    @Column("dossier_id")
    var id: Int? = null,
    var clinicalResearchId: Int? = null,
    var volume: String? = null,
    var label: String? = null,
    var amount: Int? = null
)
