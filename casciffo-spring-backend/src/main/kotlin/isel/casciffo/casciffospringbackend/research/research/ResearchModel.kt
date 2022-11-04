package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamModel
import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalModel
import isel.casciffo.casciffospringbackend.research.addenda.Addenda
import isel.casciffo.casciffospringbackend.research.dossier.Dossier
import isel.casciffo.casciffospringbackend.research.finance.overview.ResearchFinance
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivity
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitModel
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import isel.casciffo.casciffospringbackend.users.user.UserModel
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate
import java.time.LocalDateTime

@Table("clinical_research")
data class ResearchModel (
    @Id
    @Column("research_id")
    var id: Int? = null,
    var proposalId: Int? = null,
    var lastModified: LocalDateTime? = null,
    @Column("research_state_id")
    var stateId: Int? = null,
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
    var treatmentBranches: String? = null,
    var canceledReason: String? = null,
    var canceledById: Int? = null,

    @Transient
    @Value("null")
    var canceledBy: UserModel? = null,

    @Transient
    @Value("null")
    var state: State? = null,

    @Transient
    @Value("null")
    var proposal: ProposalModel? = null,

    @Transient
    @Value("null")
    var visits: Flow<VisitModel>? = null,

    @Transient
    @Value("null")
    var patients: Flow<ResearchPatient>? = null,

    @Transient
    @Value("null")
    var dossiers: Flow<Dossier>? = null,

    @Transient
    @Value("null")
    var stateTransitions: Flow<StateTransition>? = null,

    @Transient
    @Value("null")
    var scientificActivities: Flow<ScientificActivity>? = null,

    @Transient
    @Value("null")
    var investigationTeam: Flow<InvestigationTeamModel>? = null,

    @Transient
    @Value("null")
    var addendas: Flow<Addenda>? = null,

    @Transient
    @Value("null")
    var financeComponent: ResearchFinance? = null
)