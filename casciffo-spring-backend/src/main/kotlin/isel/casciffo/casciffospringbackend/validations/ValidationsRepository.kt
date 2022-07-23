package isel.casciffo.casciffospringbackend.validations

import isel.casciffo.casciffospringbackend.common.ValidationType
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface ValidationsRepository: ReactiveCrudRepository<Validation, Int> {
    fun findAllByPfcId(pfcId: Int): Flux<Validation>

    fun findByPfcIdAndValidationType(pfcId: Int, validationType: ValidationType): Mono<Validation>

    @Query(
        "SELECT CASE WHEN COUNT(*) > 0 THEN FALSE ELSE TRUE END " +
        "FROM validations v " +
        "WHERE v.validated = FALSE AND v.pfc_id=:pfcId"
    )
    fun isPfcValidated(pfcId: Int): Mono<Boolean>


    @Query(
        "SELECT CASE WHEN COUNT(*) > 0 THEN FALSE ELSE TRUE END " +
        "FROM validations v " +
        "JOIN protocol p on v.pfc_id = p.pfc_id " +
        "WHERE (v.validated = FALSE AND v.pfc_id=:pfcId) " +
            "OR (p.validated = FALSE AND p.pfc_id=:pfcId)"
    )
    fun isPfcFullyValidated(pfcId: Int): Mono<Boolean>
}