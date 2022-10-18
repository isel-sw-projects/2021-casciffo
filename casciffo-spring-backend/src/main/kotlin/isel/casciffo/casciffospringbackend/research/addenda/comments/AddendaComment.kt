package isel.casciffo.casciffospringbackend.research.addenda.comments

import isel.casciffo.casciffospringbackend.users.user.UserModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import java.time.LocalDateTime

data class AddendaComment (
    @Id
    var id: Int? = null,
    var createdDate: LocalDateTime? = null,
    var addendaId: Int? = null,
    var observation: String? = null,
    var authorId: Int? = null,

    @Transient
    @Value("null")
    var authorName: String?= null,

    @Transient
    @Value("null")
    var author: UserModel? = null,
)