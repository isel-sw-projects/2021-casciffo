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
    var id: Int?,

    @Column(value = "state_name")
    var name: String,

    @Column(value = "role_responsible_for_advancing_id")
    var ownerId: Int,

    @Transient
    @Value("null")
    var owner: UserRole?
)