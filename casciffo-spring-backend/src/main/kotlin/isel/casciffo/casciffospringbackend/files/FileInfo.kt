package isel.casciffo.casciffospringbackend.files

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("files")
data class FileInfo (
    @Id
    @Column("file_id")
    var id: Int? = null,

    val fileName: String? = null,
    val filePath: String? = null,
    val fileSize: Long? = null
)