package isel.casciffo.casciffospringbackend.states

import isel.casciffo.casciffospringbackend.roles.UserRole
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table


@Table(value = "states")
data class State(
    @Id
    @Column(value = "state_id")
    var stateId: Int?,

    @Column(value = "state_name")
    val stateName: String,

    @Column(value = "role_responsible_for_advancing_id")
    val ownerId: Int,

    @Transient
    @Value("null")
    val owner: UserRole?
)