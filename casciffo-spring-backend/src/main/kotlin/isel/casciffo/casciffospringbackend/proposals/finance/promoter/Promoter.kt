package isel.casciffo.casciffospringbackend.proposals.finance.promoter

import isel.casciffo.casciffospringbackend.common.PromoterType
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table(value = "promoter")
data class Promoter (
    @Id
    @Column(value = "promoter_id")
    var id: Int? = null,

    @Column("promoter_name")
    val name: String? = null,
    @Column("promoter_email")
    val email: String? = null,
    val promoterType: PromoterType? = null
)
