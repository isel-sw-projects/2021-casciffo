package isel.casciffo.casciffospringbackend.proposals
import isel.casciffo.casciffospringbackend.util.PROPOSAL_URI
import isel.casciffo.casciffospringbackend.util.PROPOSAL_BASE_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(PROPOSAL_BASE_URL, headers = ["Accept=application/json"])
class ProposalController(
    @Autowired val service: ProposalService
    ) {

    val mapper: ProposalMapper = ProposalMapper()

    @GetMapping
    suspend fun getAllProposals(@RequestParam(required = true) type: ResearchType): Flow<ProposalModel> {
        return service.getAllProposals(type)
    }

    @GetMapping(PROPOSAL_URI)
    suspend fun getProposal(@PathVariable(required = true) proposalId: Int) : ProposalModel {
        return service.getProposalById(proposalId)
    }

    @PostMapping
    suspend fun createProposal(@RequestBody(required = true) proposal: ProposalDTO): ProposalModel {
        return service.create(mapper.proposalDTOtoProposalModel(proposal))
    }

    @PatchMapping(PROPOSAL_URI)
    suspend fun updateProposal(
        @PathVariable(required = true) proposalId: Int,
        @RequestBody(required = true) proposal: ProposalModel
    ): ProposalModel {
        return service.updateProposal(proposal)
    }

    @DeleteMapping(PROPOSAL_URI)
    suspend fun deleteProposal(@PathVariable proposalId: Int): ProposalModel {
        return service.deleteProposal(proposalId)
    }
}
