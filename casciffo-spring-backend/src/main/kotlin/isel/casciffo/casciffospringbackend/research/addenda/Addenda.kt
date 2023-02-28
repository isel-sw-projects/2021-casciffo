package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
import java.time.LocalDateTime

@Table("addenda")
data class Addenda (
    @Id
    @Column("addenda_id")
    var id: Int? = null,

    var researchId: Int? = null,

    @Column("addenda_state_id")
    var stateId: Int? = null,

    @Column("addenda_file_id")
    var fileId: Int? = null,

    var createdDate: LocalDateTime?=null,

    @Transient
    @Value("null")
    var state: State? = null,

    @Transient
    @Value("null")
    var stateTransitions: Flow<StateTransition>? = null,

    @Transient
    @Value("null")
    var fileInfo: FileInfo? = null,

    @Transient
    @Value("null")
    var observations: Flow<AddendaComment>? = null
)