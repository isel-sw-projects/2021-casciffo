package isel.casciffo.casciffospringbackend.research.studies

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table("scientific_activities")
data class ScientificActivity (
    @Id
    @Column("activity_id")
    var id: Int? = null,
    var researchId: Int? = null,
    var datePublished: LocalDate? = null,
    var author: String? = null,
    var paperName: String? = null,
    var volume: String? = null,
    var volumeNumber: Int? = null,
    var paperNumPages: Int? = null,
    var countryPublished: String? = null,
    var hasBeenIndexed: Boolean? = null,
    var publishedUrl: String? = null,
    //TODO ADD THESE TO DB
    // var publicationType: String? = null,
    // var studyType: String? = null
)