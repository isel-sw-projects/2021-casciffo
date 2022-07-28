package isel.casciffo.casciffospringbackend.aggregates.research

import isel.casciffo.casciffospringbackend.common.ResearchType
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDate

data class ResearchAggregate(
    @Id
    @Column("research_id")
    var id: Int? = null,
    var eudra_ct: String? = null,
    var sampleSize: Int? = null,
    var duration: Int? = null,
    var cro: String? = null,
    var startDate: LocalDate? = null,
    var endDate: LocalDate? = null,
    var estimatedEndDate: LocalDate? = null,
    var estimatedPatientPool: Int? = null,
    var actualPatientPool: Int? = null,
    var industry: String? = null,
    var protocol: String? = null,
    var initiativeBy: String? = null,
    var phase: String? = null,
    var type: ResearchType? = null,
    var treatmentType: String? = null,
    var typology: String? = null,
    var specification: String? = null,
    @Column("research_state_id")
    var stateId: Int? = null,
    var stateName: String? = null,

    //info from proposal
    var proposalId: Int? = null,
    var sigla: String? = null,
    var promoterName: String? = null,

    //constants
    var serviceName: String? = null,
    var serviceId: Int? = null,
    var therapeuticAreaName: String? = null,
    var therapeuticAreaId: Int? = null,
    var pathologyName: String? = null,
    var pathologyId: Int? = null,

    //principal investigator
    @Column("user_id")
    var principalInvestigatorId: Int? = null,
    @Column("user_name")
    var principalInvestigatorName: String? = null,
    @Column("user_email")
    var principalInvestigatorEmail: String? = null,
)
