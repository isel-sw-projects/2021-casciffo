package isel.casciffo.casciffospringbackend.states

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface StateRepository : ReactiveCrudRepository<State, Int> {
    fun findByName(name: String) : Mono<State>
}