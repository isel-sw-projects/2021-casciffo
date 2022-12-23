package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.research.patients.PatientModel

class PatientWithVisitsDTO (
    val patient: PatientModel? = null,
    val scheduledVisits: List<VisitDTO>? = null
)