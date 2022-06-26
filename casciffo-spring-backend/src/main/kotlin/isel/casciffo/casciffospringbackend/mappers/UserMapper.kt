package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.users.UserDTO
import isel.casciffo.casciffospringbackend.users.UserModel
import kotlinx.coroutines.reactive.awaitSingle
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Component
class UserMapper: Mapper<UserModel, UserDTO> {
    override suspend fun mapDTOtoModel(dto: UserDTO?): UserModel {
        return if (dto === null) UserModel()
        else {
            UserModel(
                userId = dto.userId,
                name = dto.name,
                email = dto.email,
                password = dto.password,
                roles = dto.roles?.toFlux()
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
                roles = model.roles?.collectList()?.awaitSingle()
            )
        }
    }
}