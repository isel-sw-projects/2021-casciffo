package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.research.patients.PatientModel

class PatientWithVisitsDTO (
    var patient: PatientModel? = null,
    var visits: List<VisitDTO>? = null
)