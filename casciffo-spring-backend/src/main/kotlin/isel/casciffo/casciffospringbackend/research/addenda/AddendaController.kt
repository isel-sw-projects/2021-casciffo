package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.common.buildFileResponse
import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.mappers.Mapper
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
class AddendaController(
    @Autowired val service: AddendaService,
    @Autowired val mapper: Mapper<Addenda, AddendaDTO>
) {
    @GetMapping(ADDENDA_DETAIL_FILE_URL)
    suspend fun downloadAddendaFile(
        @PathVariable addendaId: Int,
        @PathVariable researchId: Int,
        response: ServerHttpResponse
    ): ResponseEntity<InputStreamResource> {
        val path = service.getAddendaFile(addendaId = addendaId, researchId = researchId)
        return buildFileResponse(path)
    }

    @GetMapping(ADDENDA_DETAIL_URL)
    suspend fun getAddendaDetails(
        @PathVariable addendaId: Int,
        @PathVariable researchId: Int
    ): ResponseEntity<AddendaDTO> {
        val addenda = service.getAddendaDetails(addendaId)
        val dto = mapper.mapModelToDTO(addenda)
        return ResponseEntity.ok(dto)
    }

    @PostMapping(ADDENDA_URL)
    suspend fun createAddenda(
        @PathVariable researchId: Int,
        @RequestPart("file") filePart: Mono<FilePart>
    ): ResponseEntity<AddendaDTO> {
        val addenda = service.createAddenda(researchId, filePart.awaitSingleOrNull())
        val dto = mapper.mapModelToDTO(addenda)
        return ResponseEntity.status(HttpStatus.CREATED).body(dto)
    }

    @PutMapping(ADDENDA_DETAIL_STATE_URL)
    suspend fun transitionState(
        @PathVariable researchId: Int,
        @PathVariable addendaId: Int,
        @RequestParam(required = true, name = "nId") nextStateId: Int,
        request: ServerHttpRequest
    ): ResponseEntity<AddendaDTO> {
        val addenda = service.transitionState(addendaId = addendaId, nextStateId = nextStateId, request)
        val dto = mapper.mapModelToDTO(addenda)
        return ResponseEntity.ok(dto)
    }

    @PutMapping(ADDENDA_DETAIL_STATE_CANCEL_URL)
    suspend fun cancelAddenda(
        @PathVariable researchId: Int,
        @PathVariable addendaId: Int,
        request: ServerHttpRequest
    ): ResponseEntity<AddendaDTO> {
        val addenda = service.cancelAddenda(addendaId = addendaId, researchId = researchId, request)
        val dto = mapper.mapModelToDTO(addenda)
        return ResponseEntity.ok(dto)
    }
}