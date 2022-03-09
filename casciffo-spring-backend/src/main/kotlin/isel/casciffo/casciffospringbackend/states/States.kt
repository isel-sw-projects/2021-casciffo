package isel.casciffo.casciffospringbackend.states

import isel.casciffo.casciffospringbackend.roles.UserRole
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table


@Table(value = "states")
class States(
    @Id
    @Column(value = "state_id")
    var stateId: Int?,

    @Column(value = "state_name")
    val stateName: String,

    @Column(value = "role_responsible_for_advancing_id")
    val ownerId: Int,

    @Transient
    val owner: UserRole?
) {
    override fun toString(): String {
        return "{id:${stateId},state:${stateName},owner:${ownerId}}"
    }
}
