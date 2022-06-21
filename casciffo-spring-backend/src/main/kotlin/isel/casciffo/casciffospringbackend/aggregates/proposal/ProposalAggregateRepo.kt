package isel.casciffo.casciffospringbackend.aggregates.proposal

import isel.casciffo.casciffospringbackend.proposals.ResearchType
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface ProposalAggregateRepo: ReactiveCrudRepository<ProposalAggregate, Int> {
    @Query(
        "SELECT p.*, " +
                "pfc.proposal_financial_id, pfc.financial_contract_id, pfc.promoter_id, pfc.has_partnerships, " +
                "state.state_name, st.service_name, ta.therapeutic_area_name, pl.pathology_name," +
                " pinv.user_name, pinv.user_email, pr.promoter_name, pr.promoter_email " +
        "FROM proposal p " +
        "JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id " +
        "JOIN pathology pl ON p.pathology_id = pl.pathology_id " +
        "JOIN service st ON st.service_id = p.service_id " +
        "JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id " +
        "JOIN promoter pr ON pfc.promoter_id = pr.promoter_id " +
        "JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id " +
        "JOIN states state ON p.state_id = state.state_id " +
        "WHERE p.proposal_id = :type"
    )
    fun findByProposalId(id: Int): Mono<ProposalAggregate>

    @Query(
        "SELECT p.proposal_id, p.sigla, p.date_created, p.last_update, p.proposal_type, " +
                "state_name, service_name, pathology_name, therapeutic_area_name, has_partnerships, " +
                "promoter_name, user_name " +
        "FROM proposal p " +
        "JOIN states state ON p.state_id = state.state_id " +
        "JOIN pathology pl ON p.pathology_id = pl.pathology_id " +
        "JOIN service st ON st.service_id = p.service_id " +
        "JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id " +
        "JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id " +
        "LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id " +
        "JOIN promoter pr ON pr.promoter_id = pfc.promoter_id " +
        "WHERE p.proposal_type = :type"
    )
    fun findAllByType(type: ResearchType): Flux<ProposalAggregate>
}