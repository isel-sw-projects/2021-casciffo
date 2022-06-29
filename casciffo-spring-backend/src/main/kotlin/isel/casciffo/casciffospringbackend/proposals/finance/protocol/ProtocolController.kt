package isel.casciffo.casciffospringbackend.proposals.finance.protocol

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_PROTOCOL_URL
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
        @PathVariable(required = true) proposalId: Int,
        @PathVariable(required = true) pfcId: Int
    ): ResponseEntity<ProtocolAndCommentsDTO> {
        val protocolDetails = protocolService.getProtocolDetails(proposalId, pfcId, true)
        return ResponseEntity.ok(protocolDetails)
    }

    @PutMapping(PROPOSAL_PROTOCOL_URL)
    suspend fun updateProtocol(
        @PathVariable(required = true) proposalId: Int,
        @PathVariable(required = true) pfcId: Int,
        @RequestBody(required = true) protocolDTO: ProtocolDTO
    ): ResponseEntity<ProtocolDTO> {
        val protocolAggregate = aggregateMapper.mapDTOtoModel(protocolDTO)
        val body = protocolService.handleNewProtocolComment(proposalId, pfcId, protocolAggregate)
        return ResponseEntity.ok(dtoMapper.mapModelToDTO(body))

    }
}