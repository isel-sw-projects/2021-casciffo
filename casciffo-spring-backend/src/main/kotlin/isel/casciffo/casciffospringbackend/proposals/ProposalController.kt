package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.roles.Roles
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

    @GetMapping(PROPOSALS_URL)
    suspend fun getAllProposals(@RequestParam(required = true) type: ResearchType): Flow<ProposalDTO> {
        return service.getAllProposals(type).map(mapper::mapModelToDTO)
    }

    @GetMapping(PROPOSAL_URL)
    suspend fun getProposal(@PathVariable(required = true) proposalId: Int) : ProposalDTO {
        val proposal = service.getProposalById(proposalId)
        return mapper.mapModelToDTO(proposal)
    }

    @PostMapping(PROPOSALS_URL)
    suspend fun createProposal(@RequestBody(required = true) proposal: ProposalDTO): ProposalDTO {
        val p = mapper.mapDTOtoModel(proposal)
        val res = service.create(p)
        return mapper.mapModelToDTO(res)
    }

    @PatchMapping(PROPOSAL_URL)
    suspend fun updateProposal(
        @PathVariable(required = true) proposalId: Int,
        @RequestBody(required = true) proposal: ProposalDTO,
    ): ProposalDTO {
        val p = mapper.mapDTOtoModel(proposal)
        val res = service.updateProposal(p)
        return mapper.mapModelToDTO(res)
    }

    @PutMapping(PROPOSAL_TRANSITION_SUPERUSER_URL)
    suspend fun superuserTransitionProposalState(
        @PathVariable(required = true) proposalId: Int,
        @RequestParam(required = true) nextStateId: Int
    ): ProposalDTO {
        return transitionState(proposalId, nextStateId, Roles.SUPERUSER)
    }
    @PutMapping(PROPOSAL_TRANSITION_UIC_URL)
    suspend fun uicTransitionProposalState(
        @PathVariable(required = true) proposalId: Int,
        @RequestParam(required = true) nextStateId: Int
    ): ProposalDTO {
        return transitionState(proposalId, nextStateId, Roles.UIC)
    }
    @PutMapping(PROPOSAL_FINANCE_VALIDATION_URL)
    suspend fun financeTransitionProposalState(
        @PathVariable(required = true) proposalId: Int,
        @RequestParam(required = true) nextStateId: Int
    ): ProposalDTO {
        return transitionState(proposalId, nextStateId, Roles.FINANCE)
    }

    @PutMapping(PROPOSAL_JURIDICAL_VALIDATION_URL)
    suspend fun juridicalTransitionProposalState(
        @PathVariable(required = true) proposalId: Int,
        @RequestParam(required = true) nextStateId: Int
    ): ProposalDTO {
        return transitionState(proposalId, nextStateId, Roles.JURIDICAL)
    }

    @PutMapping(PROPOSAL_TRANSITION_CA_URL)
    suspend fun caTransitionProposalState(
        @PathVariable(required = true) proposalId: Int,
        @RequestParam(required = true) nextStateId: Int
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
