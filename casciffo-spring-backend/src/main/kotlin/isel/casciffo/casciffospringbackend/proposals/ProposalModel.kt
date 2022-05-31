package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComments
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeam
import isel.casciffo.casciffospringbackend.proposals.constants.Pathology
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceType
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticArea
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.timelineEvents.TimelineEventModel
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import isel.casciffo.casciffospringbackend.users.User
import lombok.AllArgsConstructor
import lombok.ToString
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
import java.time.LocalDateTime
import org.springframework.data.annotation.Transient

@ToString
@AllArgsConstructor
@Table(value = "proposal")
data class ProposalModel(
    @Id
    @Column(value = "proposal_id")
    var id: Int? = null,

    @Column(value = "sigla")
    var sigla: String? = null,

    @Column(value = "proposal_type")
    var type: ResearchType? = null,

    @Column(value = "date_created")
    @CreatedDate
    var dateCreated: LocalDateTime? = null,

    @Column(value = "last_update")
    @LastModifiedDate
    var lastUpdated: LocalDateTime? = null,

    @Column(value = "state_id")
    var stateId: Int? = null,
    @Column(value = "service_id")
    var serviceTypeId: Int? = null,
    @Column(value = "therapeutic_area_id")
    var therapeuticAreaId: Int? = null,
    @Column(value = "pathology_id")
    var pathologyId: Int? = null,
    @Column(value = "principal_investigator_id")
    var principalInvestigatorId: Int? = null,

    @Transient
    @Value("null")
    var state : State? = null,

    @Transient
    @Value("null")
    var serviceType: ServiceType? = null,

    @Transient
    @Value("null")
    var therapeuticArea: TherapeuticArea? = null,

    @Transient
    @Value("null")
    var pathology: Pathology? = null,

    @Transient
    @Value("null")
    var principalInvestigator: User? = null,

    @Transient
    @Value("null")
    var financialComponent: ProposalFinancialComponent? = null,

    @Transient
    @Value("null")
    var comments: Flux<ProposalComments>? = null,

    @Transient
    @Value("null")
    var stateTransitions: Flux<StateTransition>? = null,

    @Transient
    @Value("null")
    var timelineEvents: Flux<TimelineEventModel>? = null,

    @Transient
    @Value("null")
    var investigationTeam: Flux<InvestigationTeam>? = null
)
