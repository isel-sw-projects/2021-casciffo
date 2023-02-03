package isel.casciffo.casciffospringbackend.data_management

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono


@Repository
interface PathologyRepository : ReactiveCrudRepository<Pathology, Int> {

    @Query(
        "DELETE FROM pathology WHERE pathology_id=:pathologyId"
    )
    fun deletePathologyById(pathologyId: Int): Mono<Unit>
}