package isel.casciffo.casciffospringbackend.files

import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface FileInfoRepository : ReactiveCrudRepository<FileInfo, Int> {

    @Query(
        "DELETE FROM files " +
        "WHERE files.file_id = " +
            "(SELECT pfc.financial_contract_id " +
            "FROM proposal_financial_component pfc " +
            "WHERE pfc.proposal_financial_id=:pfcId) "
    )
    fun deleteByPFCId(pfcId: Int): Mono<Void>

    @Query(
        "SELECT * " +
        "FROM files f " +
        "JOIN proposal_financial_component pfc on f.file_id = pfc.financial_contract_id " +
        "WHERE pfc.proposal_financial_id = :pfcId"
    )
    fun findByPfcId(pfcId: Int): Mono<FileInfo>
}