package isel.casciffo.casciffospringbackend.proposals.finance

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProposalProtocol
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolDTO
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Component
class PFCMapper(
    @Autowired val protocolMapper: Mapper<ProposalProtocol, ProtocolDTO>
): Mapper<ProposalFinancialComponent, ProposalFinancialComponentDTO> {
    override suspend fun mapDTOtoModel(dto: ProposalFinancialComponentDTO?): ProposalFinancialComponent {
        return if (dto === null) ProposalFinancialComponent()
        else ProposalFinancialComponent(
            id = dto.id,
            proposalId = dto.proposalId,
            promoterId = dto.promoterId,
            financialContractId = dto.financialContractId,
            partnerships = dto.partnerships?.toFlux(),
            promoter = dto.promoter,
            protocol = protocolMapper.mapDTOtoModel(dto.protocol)
        )
    }

    override suspend fun mapModelToDTO(model: ProposalFinancialComponent?): ProposalFinancialComponentDTO {
        return if (model === null) ProposalFinancialComponentDTO()
        else ProposalFinancialComponentDTO(
            id = model.id,
            proposalId = model.proposalId,
            promoterId = model.promoterId,
            financialContractId = model.financialContractId,
            partnerships = model.partnerships?.collectList()?.awaitSingleOrNull(),
            promoter = model.promoter,
            protocol = protocolMapper.mapModelToDTO(model.protocol)
        )
    }
}