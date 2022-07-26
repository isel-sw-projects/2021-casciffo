package isel.casciffo.casciffospringbackend.users.user

import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.security.BearerTokenWrapper
import isel.casciffo.casciffospringbackend.security.JwtDTO
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class UserController(
    @Autowired val service : UserService,
    @Autowired val mapper: Mapper<UserModel, UserDTO>
) {

    @PostMapping(REGISTER_URL)
    @ResponseStatus(HttpStatus.CREATED)
    suspend fun createUser(@RequestBody userDTO: UserDTO): JwtDTO {
        val model = mapper.mapDTOtoModel(userDTO)
        val tokenWrapper = service.registerUser(model)
        return JwtDTO(tokenWrapper.token, tokenWrapper.userId, tokenWrapper.userName, tokenWrapper.roles ?: listOf())
    }

    @PostMapping(LOGIN_URL)
    suspend fun loginUser(@RequestBody userDTO: UserDTO): JwtDTO {
        val model = mapper.mapDTOtoModel(userDTO)
        val tokenWrapper = service.loginUser(model)
        return JwtDTO(tokenWrapper.token, tokenWrapper.userId, tokenWrapper.userName, tokenWrapper.roles ?: listOf())
    }

    @PutMapping(USER_ROLES_URL)
    suspend fun updateUserRoles(
        @RequestBody roles: List<Int>,
        @PathVariable userId: Int
    ): ResponseEntity<BearerTokenWrapper> {
        val newToken = service.updateUserRoles(roles, userId)
        return ResponseEntity.ok().body(newToken)
    }


    @GetMapping(USER_DETAIL_URL)
    suspend fun getUser(@PathVariable userId : Int): UserDTO? {
        return mapper.mapModelToDTO(service.getUser(userId, loadDetails = true))
    }

    @GetMapping(USERS_URL)
    suspend fun getAllUsers(@RequestParam(required = false) roles: List<String>?): Flow<UserDTO?> {
        return service.getAllUsers().map(mapper::mapModelToDTO)
    }

    @GetMapping(USER_SEARCH_URL)
    suspend fun searchUsers(@RequestParam roles: List<String>, name: String): Flow<UserDTO?> {
        return service.searchUsers(name, roles).map(mapper::mapModelToDTO)
    }

    @DeleteMapping(USER_DETAIL_URL)
    suspend fun deleteUser(@PathVariable userId: Int): UserDTO {
        return mapper.mapModelToDTO(service.deleteUser(userId))
    }
}