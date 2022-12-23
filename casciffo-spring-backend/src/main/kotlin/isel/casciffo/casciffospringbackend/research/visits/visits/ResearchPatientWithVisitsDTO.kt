package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient

data class ResearchPatientWithVisitsDTO(
    val researchPatient: ResearchPatient? = null,
    val scheduledVisits: List<VisitDTO>? = null
)
