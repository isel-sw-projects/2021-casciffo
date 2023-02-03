package isel.casciffo.casciffospringbackend.data_management

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface ServiceTypeRepository : ReactiveCrudRepository<ServiceType, Int>{

    @Query(
        "DELETE FROM service WHERE service_id=:serviceTypeId"
    )
    fun deleteServiceTypeById(serviceTypeId: Int): Mono<Unit>
}