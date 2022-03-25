package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.comments.ProposalComments
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeam
import isel.casciffo.casciffospringbackend.proposals.constants.Pathology
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceType
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticArea
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.states.StateTransitions
import isel.casciffo.casciffospringbackend.users.User
import lombok.AllArgsConstructor
import lombok.ToString
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
import java.time.LocalDateTime

@ToString
@AllArgsConstructor
@Table(value = "proposal")
data class Proposal(
    @Id
    @Column(value = "proposal_id")
    var id: Int?,

    @Column(value = "sigla")
    var sigla: String,

    @Column(value = "proposal_type")
    var type: ProposalType,

    @Column(value = "date_created")//, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    @CreatedDate
    var dateCreated: LocalDateTime,

    @Column(value = "last_update")//, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    @LastModifiedDate
    var lastUpdated: LocalDateTime,

    @Column(value = "state_id")
    var stateId: Int,
    @Column(value = "service_id")
    var serviceTypeId: Int,
    @Column(value = "therapeutic_area_id")
    var therapeuticAreaId: Int,
    @Column(value = "pathology_id")
    var pathologyId: Int,
    @Column(value = "principal_investigator_id")
    var principalInvestigatorId: Int,

    @Transient
    var state : State?,

    @Transient
    var serviceType: ServiceType?,

    @Transient
    var therapeuticArea: TherapeuticArea?,

    @Transient
    var pathology: Pathology?,

    @Transient
    var principalInvestigator: User?,

    @Transient
    var investigationTeam: Flux<InvestigationTeam>?,

    @Transient
    var comments: Flux<ProposalComments>?,

    @Transient
    var financialComponent: ProposalFinancialComponent?,

    @Transient
    var stateTransitions: Flux<StateTransitions>?,

    @Transient
    var timelineEvents: Flux<TimelineEvent>?
)
