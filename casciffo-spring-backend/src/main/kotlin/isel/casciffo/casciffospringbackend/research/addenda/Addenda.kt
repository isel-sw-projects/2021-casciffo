package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import org.springframework.data.annotation.Transient
import reactor.core.publisher.Flux

@Table("addenda")
data class Addenda (
    @Id
    @Column("addenda_id")
    var id: Int?,

    var researchId: Int?,

    @Column("addenda_state_id")
    var stateId: Int?,

    @Column("addenda_file_id")
    var fileId: Int?,

    @Transient
    @Value("null")
    var state: State?,

    @Transient
    @Value("null")
    var stateTransitions: List<StateTransition>?,

    @Transient
    @Value("null")
    var fileInfo: FileInfo?
)