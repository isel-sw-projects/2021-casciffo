package isel.casciffo.casciffospringbackend.research.dossier

import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_DOSSIER_DETAIL_URL
import isel.casciffo.casciffospringbackend.endpoints.RESEARCH_DOSSIER_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(RESEARCH_DOSSIER_URL)
class DossierController(
    @Autowired val service: DossierService
) {

    @GetMapping
    suspend fun getDossierByResearchId(@PathVariable researchId: Int): Flow<Dossier> = service.findAllByResearchId(researchId)

    @PostMapping
    suspend fun createDossier(
        @PathVariable researchId: Int,
        @RequestBody dossier: Dossier
    ): ResponseEntity<Dossier> {
        val created = service.createDossier(dossier, researchId)
        return ResponseEntity.status(HttpStatus.CREATED).body(created)
    }

    @PutMapping
    suspend fun updateDossier(
        @PathVariable researchId: Int,
        @RequestBody dossier: Dossier
    ): ResponseEntity<Dossier> {
        val updated = service.updateDossier(dossier, researchId)
        return ResponseEntity.ok(updated)
    }

    @DeleteMapping("/{dossierId}")
    suspend fun deleteDossier(
        @PathVariable researchId: Int,
        @PathVariable dossierId: Int
    ): ResponseEntity<Dossier> {
        val deleted = service.deleteDossier(researchId, dossierId)
        return ResponseEntity.ok(deleted)
    }

}