package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.util.PROPOSAL_URI
import isel.casciffo.casciffospringbackend.util.PROPOSAL_BASE_URL
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(headers = ["Accept=application/json"])
class ProposalController(
    @Autowired val service: ProposalService
    ) {

    val mapper: ProposalMapper = ProposalMapper()

    @GetMapping(PROPOSAL_BASE_URL)
    suspend fun getAllProposals(@RequestParam(required = true) type: ResearchType): Flow<ProposalDTO> {
        return service.getAllProposals(type).map(mapper::proposalModelToProposalDTO)
    }

    @GetMapping(PROPOSAL_URI)
    suspend fun getProposal(@PathVariable(required = true) proposalId: Int) : ProposalDTO {
        val proposal = service.getProposalById(proposalId)
        return mapper.proposalModelToProposalDTO(proposal)
    }

    @PostMapping(PROPOSAL_BASE_URL)
    suspend fun createProposal(@RequestBody(required = true) proposal: ProposalDTO): ProposalDTO {
        val p = mapper.proposalDTOtoProposalModel(proposal)
        val res = service.create(p)
        return mapper.proposalModelToProposalDTO(res)
    }

    @PatchMapping(PROPOSAL_URI)
    suspend fun updateProposal(
        @PathVariable(required = true) proposalId: Int,
        @RequestBody(required = true) proposal: ProposalDTO
    ): ProposalDTO {
        val p = mapper.proposalDTOtoProposalModel(proposal)
        val res = service.updateProposal(p)
        return mapper.proposalModelToProposalDTO(res)
    }

    @DeleteMapping(PROPOSAL_URI)
    suspend fun deleteProposal(@PathVariable proposalId: Int): ProposalDTO {
        val res = service.deleteProposal(proposalId)
        return mapper.proposalModelToProposalDTO(res)
    }
}
