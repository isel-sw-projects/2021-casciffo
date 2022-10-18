package isel.casciffo.casciffospringbackend.research.addenda.comments

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import reactor.core.publisher.Flux

interface AddendaCommentRepository: ReactiveSortingRepository<AddendaComment, Int> {

    @Query(
        "SELECT ac.*, ua.user_name as author_name " +
        "FROM addenda_comment ac " +
        "JOIN user_account ua on ac.author_id = ua.user_id " +
        "WHERE ac.id = :addendaId " +
        "ORDER BY ac.created_date DESC"
    )
    fun findAllCommentsByAddendaId(addendaId: Int): Flux<AddendaComment>
}