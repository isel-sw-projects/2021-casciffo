package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.research.patients.PatientModel
import isel.casciffo.casciffospringbackend.research.patients.ResearchPatient
import kotlinx.coroutines.flow.Flow

data class PatientWithVisitsModel(
    val researchPatient: ResearchPatient? = null,
    val visits: Flow<VisitModel>? = null
)
