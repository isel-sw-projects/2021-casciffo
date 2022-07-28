package isel.casciffo.casciffospringbackend.research.studies

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table("scientific_activities")
data class ScientificActivity (
    @Id
    @Column("activity_id")
    var id: Int?,
    var researchId: Int?,
    var datePublished: LocalDate?,
    var author: String?,
    var paperName: String?,
    var volume: String?,
    var volumeNumber: Int?,
    var paperNumPages: Int?,
    var countryPublished: String?,
    var hasBeenIndexed: Boolean?,
    var publishedUrl: String?
)