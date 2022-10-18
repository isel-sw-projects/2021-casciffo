package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.research.patients.PatientModel

data class PatientWithVisitsModel(
    var patient: PatientModel? = null,
    var visits: List<VisitModel>? = null
)
