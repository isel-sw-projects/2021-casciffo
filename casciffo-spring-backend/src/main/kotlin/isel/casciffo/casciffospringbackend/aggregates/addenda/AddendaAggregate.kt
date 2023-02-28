package isel.casciffo.casciffospringbackend.aggregates.addenda

import isel.casciffo.casciffospringbackend.files.FileInfo
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDateTime

data class AddendaAggregate (
    @Id
    @Column("addenda_id")
    var id: Int? = null,
    var researchId: Int? = null,
    var createdDate: LocalDateTime?=null,

    var stateId: Int? = null,
    var stateName: String? = null,

    var fileId: Int? = null,
    var fileName: String? = null,
    var filePath: String? = null,
    var fileSize: Long? = null
)