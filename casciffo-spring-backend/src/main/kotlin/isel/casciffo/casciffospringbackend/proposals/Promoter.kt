package isel.casciffo.casciffospringbackend.proposals

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table(value = "promoter")
class Promoter (
    @Id
    @Column(value = "promoter_id")
    var id: Int?,

    val name: String,
    val email: String,
    val promoterType: PromoterType
) {
    override fun toString(): String {
        return "{id:${id},name:${name},email:${email},type:${promoterType}}"
    }
}
