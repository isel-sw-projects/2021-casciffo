package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.common.CountHolder
import isel.casciffo.casciffospringbackend.common.ResearchType
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface ResearchRepository: ReactiveSortingRepository<ResearchModel, Int> {

    @Query(
        "SELECT " +
            "COUNT(*) filter ( where cr.type = 'OBSERVATIONAL_STUDY' ) as studies, " +
            "COUNT(*) filter ( where cr.type = 'CLINICAL_TRIAL' ) as trials " +
        "FROM clinical_research cr"
    )
    fun countTypes(): Mono<CountHolder>

    fun findAllByType(type: ResearchType): Flux<ResearchModel>
}