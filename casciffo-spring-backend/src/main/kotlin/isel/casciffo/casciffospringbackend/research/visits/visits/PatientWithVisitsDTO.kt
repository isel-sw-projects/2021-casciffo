package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.research.patients.PatientModel

class PatientWithVisitsDTO (
    var patient: PatientModel? = null,
    var scheduledVisits: List<VisitDTO>? = null
)