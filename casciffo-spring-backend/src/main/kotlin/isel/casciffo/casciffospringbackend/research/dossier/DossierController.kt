package isel.casciffo.casciffospringbackend.research.dossier

import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_DOSSIER_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController(RESEARCH_DOSSIER_URL)
class DossierController(
    @Autowired val service: DossierService
) {

    @GetMapping
    suspend fun getDossierByResearchId(@RequestParam researchId: Int): Flow<Dossier> = service.findAllByResearchId(researchId)

    @PostMapping
    suspend fun createDossier(
        @RequestParam researchId: Int,
        @RequestBody dossier: Dossier
    ): ResponseEntity<Dossier> {
        val created = service.createDossier(dossier, researchId)
        return ResponseEntity.status(HttpStatus.CREATED).body(created)
    }

    @PutMapping
    suspend fun updateDossier(
        @RequestParam researchId: Int,
        @RequestBody dossier: Dossier
    ): ResponseEntity<Dossier> {
        val updated = service.updateDossier(dossier, researchId)
        return ResponseEntity.ok(updated)
    }

}