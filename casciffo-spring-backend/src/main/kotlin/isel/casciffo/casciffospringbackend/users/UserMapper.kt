package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.Mapper
import org.springframework.stereotype.Component

@Component
class UserMapper: Mapper<UserModel, UserDTO> {
    override suspend fun mapDTOtoModel(dto: UserDTO?): UserModel {
        return if (dto === null) UserModel()
        else {
            UserModel(
                userId = dto.userId,
                name = dto.name,
                email = dto.email,
                roleId = dto.roleId
            )
        }
    }

    override suspend fun mapModelToDTO(model: UserModel?): UserDTO {
        return if (model === null) UserDTO()
        else {
            UserDTO(
                userId = model.userId,
                name = model.name,
                email = model.email,
                roleId = model.roleId
            )
        }
    }
}