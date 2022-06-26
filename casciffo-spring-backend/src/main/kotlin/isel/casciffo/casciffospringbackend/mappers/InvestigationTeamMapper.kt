package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamDTO
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamModel
import isel.casciffo.casciffospringbackend.users.UserDTO
import isel.casciffo.casciffospringbackend.users.UserModel
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class InvestigationTeamMapper(
    @Autowired private val userMapper: Mapper<UserModel, UserDTO>
) : Mapper<InvestigationTeamModel, InvestigationTeamDTO> {
    override suspend fun mapDTOtoModel(dto: InvestigationTeamDTO?): InvestigationTeamModel {
        if (dto === null) return InvestigationTeamModel()
        return InvestigationTeamModel(
                id = dto.id,
                proposalId = dto.proposalId,
                memberRole = dto.memberRole,
                memberId = dto.memberId,
                member = userMapper.mapDTOtoModel(dto.member)
            )
    }

    override suspend fun mapModelToDTO(model: InvestigationTeamModel?): InvestigationTeamDTO {
        if (model === null) return InvestigationTeamDTO()
        return InvestigationTeamDTO(
            id = model.id,
            proposalId = model.proposalId,
            memberRole = model.memberRole,
            memberId = model.memberId,
            member = userMapper.mapModelToDTO(model.member)
        )
    }
}