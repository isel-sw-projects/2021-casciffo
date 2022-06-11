package isel.casciffo.casciffospringbackend.investigation_team

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.users.UserDTO
import isel.casciffo.casciffospringbackend.users.UserModel
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class InvestigationTeamMapper(
    @Autowired private val userMapper: Mapper<UserModel, UserDTO>
): Mapper<InvestigationTeamModel, InvestigationTeamDTO> {
    override suspend fun mapDTOtoModel(dto: InvestigationTeamDTO?): InvestigationTeamModel {
        return if(dto === null) InvestigationTeamModel()
        else {
            InvestigationTeamModel(
                id = dto.id,
                proposalId = dto.proposalId,
                memberRole = dto.memberRole,
                memberId = dto.memberId,
                member = userMapper.mapDTOtoModel(dto.member)
            )
        }
    }

    override suspend fun mapModelToDTO(model: InvestigationTeamModel?): InvestigationTeamDTO {
        return InvestigationTeamDTO(
            id = model?.id,
            proposalId = model?.proposalId,
            memberRole = model?.memberRole,
            memberId = model?.memberId,
            member = userMapper.mapModelToDTO(model?.member)
        )
    }
}