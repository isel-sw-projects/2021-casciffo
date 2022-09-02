package isel.casciffo.casciffospringbackend.research.research

import isel.casciffo.casciffospringbackend.aggregates.patients.ResearchPatientsAggregate
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamDTO
import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalModel
import isel.casciffo.casciffospringbackend.research.dossier.Dossier
import isel.casciffo.casciffospringbackend.research.patients.PatientModel
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatients
import isel.casciffo.casciffospringbackend.research.studies.ScientificActivity
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitDTO
import isel.casciffo.casciffospringbackend.research.visits.visits.VisitModel
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import java.time.LocalDate

data class ResearchDTO(
    var id: Int? = null,
    var proposalId: Int? = null,
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
    var treatmentType: String? = null,
    var typology: String? = null,
    var specification: String? = null,
    var type: ResearchType? = null,
    var state: State? = null,
    var proposal: ProposalModel? = null,
    var visits: List<VisitDTO>? = null,
    var dossiers: List<Dossier>? = null,
    var patients: List<ResearchPatientsAggregate>? = null,
    var stateTransitions: List<StateTransition>? = null,
    var scientificActivities: List<ScientificActivity>? = null,
    var investigationTeam: List<InvestigationTeamDTO>? = null
)
