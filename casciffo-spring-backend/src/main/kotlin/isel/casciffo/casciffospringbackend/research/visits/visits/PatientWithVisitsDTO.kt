package isel.casciffo.casciffospringbackend.research.visits.visits

import isel.casciffo.casciffospringbackend.research.patients.Patient

class PatientWithVisitsDTO (
    var patient: Patient? = null,
    var visits: List<VisitDTO>? = null
)