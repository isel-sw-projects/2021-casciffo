package isel.casciffo.casciffospringbackend.users.notifications

import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface NotificationRepository: ReactiveSortingRepository<NotificationModel, Int> {
    fun findAllByUserId(userId: Int): Flux<NotificationModel>
    fun countAllByUserIdAndViewedIsFalse(userId: Int): Mono<Int>
}