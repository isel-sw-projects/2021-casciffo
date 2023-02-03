package isel.casciffo.casciffospringbackend.data_management

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface TherapeuticAreaRepository : ReactiveCrudRepository<TherapeuticArea, Int>{

    @Query(
        "DELETE FROM therapeutic_area WHERE therapeutic_area_id=:therapeuticAreaId"
    )
    fun deleteTherapeuticAreaById(therapeuticAreaId: Int): Mono<Unit>
}