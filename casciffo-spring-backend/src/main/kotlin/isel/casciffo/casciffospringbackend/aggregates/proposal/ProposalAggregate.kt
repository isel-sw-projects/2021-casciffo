package isel.casciffo.casciffospringbackend.aggregates.proposal

import isel.casciffo.casciffospringbackend.common.ResearchType
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import java.time.LocalDate
import java.time.LocalDateTime

data class ProposalAggregate (
    //proposal
    @Id
    var proposalId: Int? = null,
    var sigla: String? = null,
    var proposalType: ResearchType? = null,
    var createdDate: LocalDate? = null,
    var lastModified: LocalDateTime? = null,

    //state
    var stateId: Int? = null,
    var stateName: String? = null,

    //principal investigator
    @Column("user_name")
    var piName: String? = null,
    @Column("user_email")
    var piEmail: String? = null,
    @Column("principal_investigator_id")
    var piId: Int? = null,

    //constants
    var serviceName: String? = null,
    var serviceId: Int? = null,
    var therapeuticAreaName: String? = null,
    var therapeuticAreaId: Int? = null,
    var pathologyName: String? = null,
    var pathologyId: Int? = null,

    //research
    var researchId: Int? = null,

    //financial component
    @Column("proposal_financial_id")
    var pfcId: Int? = null,
    var promoterId: Int? = null,
    var financialContractId: Int? = null,
    var hasPartnerships: Boolean? = null,

    //financial contract info
    var fileName: String? = null,
    var fileSize: Long? = null,

    //promoter
    var promoterName: String? = null,
    var promoterEmail: String? = null,

    //protocol
    var protocolId: Int? = null,
    var validatedDate: LocalDate? = null,
    var validated: Boolean? = null,
    var commentRef: Int? = null
)