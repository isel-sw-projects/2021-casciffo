package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_PROTOCOL_URL
import isel.casciffo.casciffospringbackend.mappers.Mapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class ProtocolController(
    @Autowired val protocolService: ProtocolService,
    @Autowired val aggregateMapper: Mapper<ProtocolAggregate, ProtocolDTO>,
    @Autowired val dtoMapper: Mapper<ProposalProtocol, ProtocolDTO>
) {

    @GetMapping(PROPOSAL_PROTOCOL_URL)
    suspend fun getProtocolDetails(
        @PathVariable proposalId: Int,
        @PathVariable pfcId: Int
    ): ResponseEntity<ProtocolAndCommentsDTO> {
        val protocolDetails = protocolService.getProtocolDetails(proposalId, pfcId, true)
        return ResponseEntity.ok(protocolDetails)
    }

    @PutMapping(PROPOSAL_PROTOCOL_URL)
    suspend fun updateProtocol(
        @PathVariable proposalId: Int,
        @PathVariable pfcId: Int,
        @RequestBody protocolDTO: ProtocolDTO
    ): ResponseEntity<ProtocolAggregate> {
        val protocolAggregate = aggregateMapper.mapDTOtoModel(protocolDTO)
        val body = protocolService.handleNewProtocolComment(proposalId, pfcId, protocolAggregate)
        return ResponseEntity.ok(body)

    }
}