package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.config.IsUIC
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_BASE_URL
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_TRANSITION_URL
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_URL
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(headers = ["Accept=application/json"])
class ProposalController(
    @Autowired val service: ProposalService,
    @Autowired val mapper: Mapper<ProposalModel, ProposalDTO>
    ) {

    @GetMapping(PROPOSAL_BASE_URL)
    suspend fun getAllProposals(@RequestParam(required = true) type: ResearchType): Flow<ProposalDTO> {
        return service.getAllProposals(type).map(mapper::mapModelToDTO)
    }

    @GetMapping(PROPOSAL_URL)
    suspend fun getProposal(@PathVariable(required = true) proposalId: Int) : ProposalDTO {
        val proposal = service.getProposalById(proposalId)
        return mapper.mapModelToDTO(proposal)
    }

    @PostMapping(PROPOSAL_BASE_URL)
    @IsUIC
    suspend fun createProposal(@RequestBody(required = true) proposal: ProposalDTO): ProposalDTO {
        val p = mapper.mapDTOtoModel(proposal)
        val res = service.create(p)
        return mapper.mapModelToDTO(res)
    }

    @PatchMapping(PROPOSAL_URL)
    @IsUIC
    suspend fun updateProposal(
        @PathVariable(required = true) proposalId: Int,
        @RequestBody(required = true) proposal: ProposalDTO
    ): ProposalDTO {
        val p = mapper.mapDTOtoModel(proposal)
        val res = service.updateProposal(p)
        return mapper.mapModelToDTO(res)
    }

    //TODO some thinking is required since all roles can update the state of a proposal
    // however which states they can update is role-locked
    // proposal: create more role-authorized endpoints and call same updateState function
    @PutMapping(PROPOSAL_TRANSITION_URL)
    suspend fun transitionProposalState(
        @PathVariable(required = true) proposalId: Int,
        @RequestParam(required = true) forward: Boolean
    ): ProposalDTO {
        val res = service.advanceState(proposalId, forward)
        return mapper.mapModelToDTO(res)
    }


    @DeleteMapping(PROPOSAL_URL)
    @IsUIC
    suspend fun deleteProposal(@PathVariable proposalId: Int): ProposalDTO {
        val res = service.deleteProposal(proposalId)
        return mapper.mapModelToDTO(res)
    }
}
