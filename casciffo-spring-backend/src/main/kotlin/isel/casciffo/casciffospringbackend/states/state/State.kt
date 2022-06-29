package isel.casciffo.casciffospringbackend.states.state

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux


@Table(value = "states")
data class State(
    @Id
    @Column(value = "state_id")
    var id: Int? = null,

    @Column(value = "state_name")
    var name: String? = null,

    @Transient
    @Value("null")
    var roles: Flux<String>? = null,

    @Transient
    @Value("null")
    var nextStates: Flux<StateCoreInfo>? = null
)