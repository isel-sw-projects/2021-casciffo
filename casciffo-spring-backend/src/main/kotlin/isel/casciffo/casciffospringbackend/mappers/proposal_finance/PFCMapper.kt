package isel.casciffo.casciffospringbackend.mappers.proposal_finance

import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.proposals.finance.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.finance.finance.ProposalFinancialComponentDTO
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
        return if (dto == null) ProposalFinancialComponent()
        else ProposalFinancialComponent(
            id = dto.id,
            proposalId = dto.proposalId,
            promoterId = dto.promoterId,
            financialContractId = dto.financialContractId,
            partnerships = dto.partnerships?.toFlux(),
            promoter = dto.promoter,
            protocol = protocolMapper.mapDTOtoModel(dto.protocol),
            validations = dto.validations?.toFlux(),
            hasPartnerships = dto.hasPartnerships,
            financialContract = if (dto.financialContract != null) FileInfo(
                id = dto.financialContract!!.id,
                fileSize = dto.financialContract!!.fileSize,
                fileName = dto.financialContract!!.fileName,
            ) else null
        )
    }

    override suspend fun mapModelToDTO(model: ProposalFinancialComponent?): ProposalFinancialComponentDTO {
        return if (model == null) ProposalFinancialComponentDTO()
        else ProposalFinancialComponentDTO(
            id = model.id,
            proposalId = model.proposalId,
            promoterId = model.promoterId,
            financialContractId = model.financialContractId,
            partnerships = model.partnerships?.collectList()?.awaitSingleOrNull(),
            promoter = model.promoter,
            protocol = protocolMapper.mapModelToDTO(model.protocol),
            validations = model.validations?.collectList()?.awaitSingleOrNull(),
            hasPartnerships = model.hasPartnerships,
            financialContract = if (model.financialContract != null) FileInfo(
                id = model.financialContract!!.id,
                fileSize = model.financialContract!!.fileSize,
                fileName = model.financialContract!!.fileName,
            ) else null
        )
    }
}