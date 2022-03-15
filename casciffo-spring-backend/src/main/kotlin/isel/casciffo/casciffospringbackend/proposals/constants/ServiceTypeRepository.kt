package isel.casciffo.casciffospringbackend.proposals.constants

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ServiceTypeRepository : ReactiveCrudRepository<ServiceType, Int> {
}