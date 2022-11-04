package isel.casciffo.casciffospringbackend.aggregates.research

import isel.casciffo.casciffospringbackend.common.ResearchType
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveSortingRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface ResearchAggregateRepo: ReactiveSortingRepository<ResearchAggregate, Int> {

    @Query(
        "SELECT cr.*, p.sigla, " +
                "state.state_name, state.state_id, " +
                "st.service_name, st.service_id, " +
                "ta.therapeutic_area_name, ta.therapeutic_area_id, " +
                "pl.pathology_name, pl.pathology_id, " +
                "pinv.user_id, pinv.user_name, pinv.user_email, " +
                "pr.promoter_name " +
                "FROM clinical_research cr " +
                "JOIN proposal p on cr.proposal_id = p.proposal_id " +
                "JOIN pathology pl ON p.pathology_id = pl.pathology_id " +
                "JOIN service st ON st.service_id = p.service_id " +
                "JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id " +
                "JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id " +
                "JOIN states state ON cr.research_state_id = state.state_id " +
                "LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id " +
                "LEFT JOIN promoter pr ON pfc.promoter_id = pr.promoter_id " +
                "WHERE cr.type=:type"
    )
    fun findAllByType(type: ResearchType): Flux<ResearchAggregate>

    @Query(
        "SELECT cr.*, p.sigla, " +
                "state.state_name, state.state_id, " +
                "st.service_name, st.service_id, " +
                "ta.therapeutic_area_name, ta.therapeutic_area_id, " +
                "pl.pathology_name, pl.pathology_id, " +
                "pinv.user_id, pinv.user_name, pinv.user_email, " +
                "pr.promoter_name " +
                "FROM clinical_research cr " +
                "JOIN proposal p on cr.proposal_id = p.proposal_id " +
                "JOIN pathology pl ON p.pathology_id = pl.pathology_id " +
                "JOIN service st ON st.service_id = p.service_id " +
                "JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id " +
                "JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id " +
                "JOIN states state ON cr.research_state_id = state.state_id " +
                "LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id " +
                "LEFT JOIN promoter pr ON pfc.promoter_id = pr.promoter_id " +
                "WHERE cr.research_id=:id"
    )
    fun findAggregateById(researchId: Int): Mono<ResearchAggregate>

    @Query(
        "SELECT cr.*, p.sigla, " +
                "state.state_name, state.state_id, " +
                "st.service_name, st.service_id, " +
                "ta.therapeutic_area_name, ta.therapeutic_area_id, " +
                "pl.pathology_name, pl.pathology_id, " +
                "pinv.user_id, pinv.user_name, pinv.user_email, " +
                "pr.promoter_name " +
                "FROM clinical_research cr " +
                "JOIN proposal p on cr.proposal_id = p.proposal_id " +
                "JOIN pathology pl ON p.pathology_id = pl.pathology_id " +
                "JOIN service st ON st.service_id = p.service_id " +
                "JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id " +
                "JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id " +
                "JOIN states state ON cr.research_state_id = state.state_id " +
                "LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id " +
                "LEFT JOIN promoter pr ON pfc.promoter_id = pr.promoter_id " +
                "ORDER BY cr.last_modified DESC " +
                "LIMIT :n"
    )
    fun findLatestModifiedResearch(n: Int): Flux<ResearchAggregate>
}