package isel.casciffo.casciffospringbackend.proposals.proposal

import isel.casciffo.casciffospringbackend.common.FILE_NAME_HEADER
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.roles.Roles
import isel.casciffo.casciffospringbackend.statistics.ProposalStats
import isel.casciffo.casciffospringbackend.validations.ValidationComment
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.InputStreamResource
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.ContentDisposition
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import java.nio.file.Files
import kotlin.io.path.fileSize

@RestController
@RequestMapping(headers = ["Accept=application/json,multipart/form-data"])
class ProposalController(
    @Autowired val service: ProposalService,
    @Autowired val mapper: Mapper<ProposalModel, ProposalDTO>
    ) {

    /**
     * Fetches all proposals.
     * @param type The research type.
     * @param p The page to fetch. Default is 1.
     * @param n The number of elements to fetch. Default is 20.
     * @param s The sorting attributed. Uses createdDate by default
     * @param so The sort order; true for ASC, false for DESC, false by default.
     * @return Returns all proposals of type [type]. Limited by [n]
     */
    @GetMapping(PROPOSALS_URL)
    suspend fun getAllProposals(
        @RequestParam type: ResearchType,
        @RequestParam(required = false, defaultValue = "1") p: Int,
        @RequestParam(required = false, defaultValue = "20") n: Int,
        @RequestParam(required = false, defaultValue = "created_date") s: String,
        @RequestParam(required = false, defaultValue = "false") so: Boolean
    ): Flow<ProposalDTO> {
        val page = PageRequest.of(p, n, if(so) Sort.by(s).descending() else Sort.by(s).ascending())
        //TODO add total count
        return service.getAllProposals(type, page).map(mapper::mapModelToDTO)
    }


    @GetMapping(PROPOSALS_LASTEST_MODIFIED_URL)
    suspend fun getLatestModifiedProposals(
        @RequestParam(required = false, defaultValue = "5") n: Int
    ): Flow<ProposalDTO> {
        val proposals = service.getLatestModifiedProposals(n)
        return proposals.map(mapper::mapModelToDTO)
    }


    @GetMapping(PROPOSAL_URL)
    suspend fun getProposal(@PathVariable proposalId: Int) : ProposalDTO {
        val proposal = service.getProposalById(proposalId)
        return mapper.mapModelToDTO(proposal)
    }

    @PostMapping(PROPOSALS_URL)
    suspend fun createProposal(
        @RequestBody proposal: ProposalDTO
    ): ProposalDTO {
        val p = mapper.mapDTOtoModel(proposal)
        val res = service.create(p)
        return mapper.mapModelToDTO(res)
    }

    @PatchMapping(PROPOSAL_URL)
    suspend fun updateProposal(
        @PathVariable proposalId: Int,
        @RequestBody proposal: ProposalDTO,
    ): ProposalDTO {
        val p = mapper.mapDTOtoModel(proposal)
        val res = service.updateProposal(p)
        return mapper.mapModelToDTO(res)
    }

    @GetMapping(PROPOSAL_GENERAL_STATS_URL)
    suspend fun getProposalStats(): ResponseEntity<Flow<ProposalStats>> {
        val stats = service.getProposalStats()
        return ResponseEntity.ok(stats)
    }

    @PutMapping(PROPOSAL_TRANSITION_SUPERUSER_URL)
    suspend fun superuserTransitionProposalState(
        @PathVariable proposalId: Int,
        @RequestParam nextStateId: Int
    ): ProposalDTO {
        return transitionState(proposalId, nextStateId, Roles.SUPERUSER)
    }

    @PutMapping(PROPOSAL_TRANSITION_URL)
    suspend fun transitionProposalStateV2(
        @PathVariable proposalId: Int,
        @RequestParam nextStateId: Int,
        request: ServerHttpRequest
    ): ProposalDTO {
        return transitionStateV2(proposalId, nextStateId, request)
    }

    private suspend fun transitionStateV2(proposalId: Int, nextStateId: Int, request: ServerHttpRequest): ProposalDTO {
        val res = service.transitionStateV2(proposalId, nextStateId, request)
        val dto = mapper.mapModelToDTO(res)
        return getProposal(dto.id!!)
    }

    @PostMapping(PROPOSAL_FINANCIAL_FILE_UPLOAD_URL)
    suspend fun uploadFinancialContract(
        @PathVariable proposalId: Int,
        @PathVariable pfcId: Int,
        @RequestPart("file") filePart: Mono<FilePart>
    ): ResponseEntity<Void> {
        service.uploadCF(proposalId, pfcId, filePart.awaitSingleOrNull())
        return ResponseEntity.ok().build()
    }

    //inspired by https://github.com/barlog-m/spring-webflux-file-upload-download-example
    @GetMapping(PROPOSAL_FINANCIAL_FILE_DOWNLOAD_URL)
    suspend fun downloadFinancialContract(
        @PathVariable proposalId: Int,
        @PathVariable pfcId: Int,
        response: ServerHttpResponse
    ): ResponseEntity<InputStreamResource> {
        val path = service.downloadCF(proposalId, pfcId)
        val fileName = path.fileName.toString().replaceAfterLast("-","").dropLast(1)
        return ResponseEntity.ok()
            .headers {
                //attachment header very important because it tells the browser to commence the download natively
                it.contentDisposition = ContentDisposition.parse("attachment")
                it.contentType = MediaType.APPLICATION_PDF
                it.contentLength = path.fileSize()
                it.set(FILE_NAME_HEADER, fileName)
                it.accessControlExposeHeaders = listOf(FILE_NAME_HEADER)
            }
            .body(InputStreamResource(withContext(Dispatchers.IO) {
                Files.newInputStream(path)
            }))
    }

    @PutMapping(PROPOSAL_TRANSITION_UIC_URL)
    suspend fun uicTransitionProposalState(
        @PathVariable proposalId: Int,
        @RequestParam nextStateId: Int
    ): ProposalDTO {
        return transitionState(proposalId, nextStateId, Roles.UIC)
    }

    @PutMapping(PROPOSAL_FINANCE_VALIDATION_URL)
    suspend fun financeTransitionProposalState(
        @PathVariable proposalId: Int,
        @PathVariable pfcId: Int,
        @RequestBody validationComment: ValidationComment
    ): ResponseEntity<ProposalValidationDTO> {
        val res = service.validatePfc(proposalId, pfcId, validationComment)
        val prop = if(res.proposal == null) null else mapper.mapModelToDTO(res.proposal)
        val dto = ProposalValidationDTO(prop,res.validation)
        return ResponseEntity.ok(dto)
    }

    @PutMapping(PROPOSAL_JURIDICAL_VALIDATION_URL)
    suspend fun juridicalTransitionProposalState(
        @PathVariable proposalId: Int,
        @PathVariable pfcId: Int,
        @RequestBody validationComment: ValidationComment
    ): ResponseEntity<ProposalValidationDTO> {
        val res = service.validatePfc(proposalId, pfcId, validationComment)
        val prop = if(res.proposal == null) null else mapper.mapModelToDTO(res.proposal)
        val dto = ProposalValidationDTO(prop,res.validation)
        return ResponseEntity.ok(dto)
    }

    @PutMapping(PROPOSAL_TRANSITION_CA_URL)
    suspend fun caTransitionProposalState(
        @PathVariable proposalId: Int,
        @RequestParam nextStateId: Int
    ): ProposalDTO {
        return transitionState(proposalId, nextStateId, Roles.CA)
    }

    private suspend fun transitionState(
        proposalId: Int,
        nextStateId: Int,
        role: Roles
    ): ProposalDTO {
        val res = service.transitionState(proposalId, nextStateId, role)
        return mapper.mapModelToDTO(res)
    }


    @DeleteMapping(PROPOSAL_URL)
    suspend fun deleteProposal(@PathVariable proposalId: Int): ProposalDTO {
        val res = service.deleteProposal(proposalId)
        return mapper.mapModelToDTO(res)
    }
}
