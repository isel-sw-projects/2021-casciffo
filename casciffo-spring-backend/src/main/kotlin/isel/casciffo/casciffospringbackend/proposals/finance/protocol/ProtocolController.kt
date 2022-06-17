package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.config.IsUIC
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_PROTOCOL_URL
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class ProtocolController(
    @Autowired val service: ProtocolService, @Autowired val mapper: Mapper<ProposalProtocol, ProtocolDTO>
) {

    @GetMapping(PROPOSAL_PROTOCOL_URL)
    suspend fun getProtocol(@PathVariable proposalId: Int, @PathVariable pfcId: Int): ProtocolDTO {
        val protocol = service.findProtocolByProposalFinanceId(proposalId, pfcId)
        return mapper.mapModelToDTO(protocol)
    }

    @PutMapping(PROPOSAL_PROTOCOL_URL)
    @IsUIC
    suspend fun updateProtocol(
        @PathVariable proposalId: Int,
        @PathVariable pfcId: Int,
        @RequestBody body: ProtocolDTO
    ): ProtocolDTO {
        val protocol = mapper.mapDTOtoModel(body)
        return mapper.mapModelToDTO(service.updateProtocol(protocol))
    }
}