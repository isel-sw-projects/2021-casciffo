package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.research.patients.PatientModel
import kotlinx.coroutines.flow.Flow

data class PatientWithVisitsModel(
    val patient: PatientModel? = null,
    val visits: Flow<VisitModel>? = null
)
