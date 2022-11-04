package isel.casciffo.casciffospringbackend.aggregates.proposal

import isel.casciffo.casciffospringbackend.common.ResearchType
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
@Repository
interface ProposalAggregateRepo: ReactiveSortingRepository<ProposalAggregate, Int> {

//    @Query(
//        "SELECT p.*, " +
//                "pfc.proposal_financial_id, pfc.financial_contract_id, pfc.promoter_id, pfc.has_partnerships, " +
//                "state.state_name, st.service_name, ta.therapeutic_area_name, pl.pathology_name, " +
//                "pinv.user_name, pinv.user_email, pr.promoter_name, pr.promoter_email, prot.protocol_id, " +
//                "prot.validated, prot.validated_date, prot.comment_ref, " +
//                "f.file_name, f.file_size " +
//        "FROM proposal p " +
//        "JOIN pathology pl ON p.pathology_id = pl.pathology_id " +
//        "JOIN service st ON st.service_id = p.service_id " +
//        "JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id " +
//        "JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id " +
//        "JOIN states state ON p.state_id = state.state_id " +
//        "LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id " +
//        "LEFT JOIN promoter pr ON pfc.promoter_id = pr.promoter_id " +
//        "LEFT JOIN protocol prot on pfc.proposal_financial_id = prot.pfc_id " +
//        "LEFT JOIN files f ON pfc.financial_contract_id = f.file_id " +
//        "WHERE p.proposal_type = :type " +
//        "ORDER BY :order " +
//        "LIMIT :n " +
//        "OFFSET :p * :n"
//    )
//    fun findAllByTypeSorting(type: ResearchType, order: String, n: Int, p: Int): Mono<ProposalAggregate>

    @Query(
        "SELECT p.*, " +
                "pfc.proposal_financial_id, pfc.financial_contract_id, pfc.promoter_id, pfc.has_partnerships, " +
                "state.state_name, st.service_name, ta.therapeutic_area_name, pl.pathology_name, " +
                "pinv.user_name, pinv.user_email, pr.promoter_name, pr.promoter_email, prot.protocol_id, " +
                "prot.validated, prot.validated_date, prot.comment_ref, " +
                "f.file_name, f.file_size " +
        "FROM proposal p " +
        "JOIN pathology pl ON p.pathology_id = pl.pathology_id " +
        "JOIN service st ON st.service_id = p.service_id " +
        "JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id " +
        "JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id " +
        "JOIN states state ON p.state_id = state.state_id " +
        "LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id " +
        "LEFT JOIN promoter pr ON pfc.promoter_id = pr.promoter_id " +
        "LEFT JOIN protocol prot on pfc.proposal_financial_id = prot.pfc_id " +
        "LEFT JOIN files f ON pfc.financial_contract_id = f.file_id " +
        "WHERE p.proposal_id = :id "
    )
    fun findByProposalId(id: Int): Mono<ProposalAggregate>

    @Query(
        "SELECT p.proposal_id, p.sigla, p.created_date, p.last_modified, p.proposal_type, " +
                "pfc.proposal_financial_id, pfc.financial_contract_id, pfc.promoter_id, pfc.has_partnerships, " +
                "state.state_name, st.service_name, pl.pathology_name, ta.therapeutic_area_name, " +
                "promoter_name, user_name " +
        "FROM proposal p " +
        "JOIN states state ON p.state_id = state.state_id " +
        "JOIN pathology pl ON p.pathology_id = pl.pathology_id " +
        "JOIN service st ON st.service_id = p.service_id " +
        "JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id " +
        "JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id " +
        "LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id " +
        "LEFT JOIN promoter pr ON pr.promoter_id = pfc.promoter_id " +
        "WHERE p.proposal_type = :type " +
        "ORDER BY p.created_date DESC "
    )
    fun findAllByType(type: ResearchType): Flux<ProposalAggregate>

    @Query(
        "SELECT p.proposal_id, p.sigla, p.created_date, p.last_modified, p.proposal_type, " +
                "pfc.proposal_financial_id, pfc.financial_contract_id, pfc.promoter_id, pfc.has_partnerships, " +
                "state.state_name, st.service_name, pl.pathology_name, ta.therapeutic_area_name, " +
                "promoter_name, user_name " +
        "FROM proposal p " +
        "JOIN states state ON p.state_id = state.state_id " +
        "JOIN pathology pl ON p.pathology_id = pl.pathology_id " +
        "JOIN service st ON st.service_id = p.service_id " +
        "JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id " +
        "JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id " +
        "LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id " +
        "LEFT JOIN promoter pr ON pr.promoter_id = pfc.promoter_id " +
        "WHERE p.proposal_type = :type " +
        "ORDER BY p.last_modified DESC " +
        "LIMIT :n"
    )
    fun findLastModifiedProposals(n: Int, type: ResearchType): Flux<ProposalAggregate>

    @Query(
        "SELECT CASE WHEN COUNT(id)=4 THEN TRUE ELSE FALSE END " +
        "FROM (" +
                "SELECT p.pathology_id as id " +
                "FROM pathology p " +
                "WHERE p.pathology_id=:pathologyId " +
                "UNION ALL " +
                "SELECT st.service_id as id " +
                "FROM service st " +
                "WHERE st.service_id=:serviceTypeId " +
                "UNION ALL " +
                "SELECT ta.therapeutic_area_id as id " +
                "FROM therapeutic_area ta " +
                "WHERE ta.therapeutic_area_id=:therapeuticAreaId " +
                "UNION ALL " +
                "SELECT ua.user_id as id " +
                "FROM user_account ua " +
                "WHERE ua.user_id=:investigatorId " +
            ") as pisi"
    )
    fun areForeignKeysValid(
        pathologyId: Int,
        serviceTypeId: Int,
        therapeuticAreaId: Int,
        investigatorId: Int
    ): Mono<Boolean>
}