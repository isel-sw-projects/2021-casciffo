package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import java.time.LocalDateTime

data class AddendaDTO (
    var id: Int? = null,
    var researchId: Int? = null,
    var stateId: Int? = null,
    var fileId: Int? = null,
    var createdDate: LocalDateTime?=null,
    var state: State? = null,
    var stateTransitions: List<StateTransition>? = null,
    var fileInfo: FileInfo? = null,
    var observations: List<AddendaComment>? = null
)