package isel.casciffo.casciffospringbackend.aggregates.addenda

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface AddendaAggregateRepo : ReactiveSortingRepository<AddendaAggregate, Int> {


    @Query(
        "SELECT a.*, s.state_name " +
        "FROM addenda a " +
        "JOIN states s on a.addenda_state_id = s.state_id " +
        "JOIN files f on a.addenda_file_id = f.file_id " +
        "WHERE a.research_id=:researchId " +
        "ORDER BY a.created_date DESC "
    )
    fun findAllByResearchId(researchId: Int): Flux<AddendaAggregate>
}