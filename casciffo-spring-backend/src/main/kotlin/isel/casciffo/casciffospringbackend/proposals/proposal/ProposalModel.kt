package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamModel
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalComment
import isel.casciffo.casciffospringbackend.data_management.Pathology
import isel.casciffo.casciffospringbackend.data_management.ServiceType
import isel.casciffo.casciffospringbackend.data_management.TherapeuticArea
import isel.casciffo.casciffospringbackend.proposals.finance.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventModel
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import isel.casciffo.casciffospringbackend.users.user.UserModel
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import reactor.core.publisher.Flux
import java.time.LocalDate
import java.time.LocalDateTime

@Table(value = "proposal")
data class ProposalModel(
    @Id
    @Column(value = "proposal_id")
    var id: Int? = null,
    @Column(value = "sigla")
    var sigla: String? = null,
    @Column(value = "proposal_type")
    var type: ResearchType? = null,
    @Column(value = "created_date")
    var createdDate: LocalDate? = null,
    @Column(value = "last_modified")
    var lastModified: LocalDateTime? = null,
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

    /**
     * Doesn't exist in entity itself.
     * It's mapped in the repository through a join with the entity proposal_research
     */
    @Transient
    @Value("null")
    var researchId: Int? = null,

    @Transient
    @Value("null")
    var files: Flow<FileInfo>? = null,

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
    var principalInvestigator: UserModel? = null,

    @Transient
    @Value("null")
    var financialComponent: ProposalFinancialComponent? = null,

    @Transient
    @Value("null")
    var comments: Flow<ProposalComment>? = null,

    @Transient
    @Value("null")
    var stateTransitions: Flow<StateTransition>? = null,

    @Transient
    @Value("null")
    var timelineEvents: Flux<TimelineEventModel>? = null,

    @Transient
    @Value("null")
    var investigationTeam: Flux<InvestigationTeamModel>? = null
)
