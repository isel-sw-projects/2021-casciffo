package isel.casciffo.casciffospringbackend.proposals.comments

import kotlinx.coroutines.flow.Flow
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ProposalCommentsRepository: ReactiveSortingRepository<ProposalComment, Int> {
    fun findByProposalId(id: Int): Flux<ProposalComment>
}