package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.proposals.ProtocolDTO
import isel.casciffo.casciffospringbackend.proposals.ProtocolMapper
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_PROTOCOL_URL
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class ProtocolController(
    @Autowired val service: ProtocolService,
    @Autowired val pfcService: ProposalFinancialService
) {
    val mapper = ProtocolMapper()

    @GetMapping(PROPOSAL_PROTOCOL_URL)
    suspend fun getProtocol(@PathVariable proposalId: Int, @PathVariable pfcId: Int): ProtocolDTO {
        val protocol = service.findProtocolByProposalFinanceId(proposalId, pfcId)
        return mapper.mapProtocolModelToDTO(protocol)
    }

    @PutMapping(PROPOSAL_PROTOCOL_URL)
    suspend fun updateProtocol(@PathVariable proposalId: Int, @RequestBody body: ProtocolDTO): ProtocolDTO {
        val protocol = mapper.mapProtocolDTOToModel(body)
        return mapper.mapProtocolModelToDTO(service.updateProtocol(protocol))
    }
}