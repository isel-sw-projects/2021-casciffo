package isel.casciffo.casciffospringbackend.promoter

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface PromoterRepository : ReactiveCrudRepository<Promoter, Int>