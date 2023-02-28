package isel.casciffo.casciffospringbackend.research.addenda.comments

import org.springframework.data.annotation.Id
import java.time.LocalDateTime

data class AddendaCommentAggregate(
    @Id
    var id: Int? = null,
    var createdDate: LocalDateTime? = null,
    var addendaId: Int? = null,
    var observation: String? = null,
    var authorId: Int? = null,
    var authorName: String?= null
)
