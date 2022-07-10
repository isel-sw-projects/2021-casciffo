package isel.casciffo.casciffospringbackend.validations

import isel.casciffo.casciffospringbackend.common.ValidationType
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("validations")
data class Validation(
    @Id
    var id: Int? = null,
    var pfcId: Int? = null,
    var commentRef: Int? = null,
    var validationType: ValidationType? = null,
    var validationDate: LocalDateTime? = null,
    var validated: Boolean? = null
)
