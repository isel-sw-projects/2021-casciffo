package isel.casciffo.casciffospringbackend.promoter

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table(value = "promoter")
data class Promoter (
    @Id
    @Column(value = "promoter_id")
    var id: Int?,

    val name: String,
    val email: String,
    @Column(value = "promoter_type")
    val promoterType: PromoterType
)
