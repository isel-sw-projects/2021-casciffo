package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.states.StateTransitions
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

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
    var stateTransitions: List<StateTransitions>?,

    @Transient
    var fileInfo: FileInfo?
)