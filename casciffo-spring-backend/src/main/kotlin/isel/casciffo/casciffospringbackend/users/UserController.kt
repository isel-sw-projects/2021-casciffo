package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.Mapper
import isel.casciffo.casciffospringbackend.config.IsSuperuser
import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.security.JwtDTO
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
class UserController(
    @Autowired val service : UserService,
    @Autowired val mapper: Mapper<UserModel, UserDTO>
) {

    @PostMapping(REGISTER_URL)
    @ResponseStatus(HttpStatus.CREATED)
    suspend fun createUser(@RequestBody(required = true) userDTO: UserDTO): JwtDTO {
        val model = mapper.mapDTOtoModel(userDTO)
        val tokenWrapper = service.registerUser(model)
        return JwtDTO(tokenWrapper.token.value, tokenWrapper.userId)
    }

    @PostMapping(LOGIN_URL)
    suspend fun loginUser(@RequestBody(required = true) userDTO: UserDTO): JwtDTO {
        val model = mapper.mapDTOtoModel(userDTO)
        val tokenWrapper = service.loginUser(model)
        return JwtDTO(tokenWrapper.token.value, tokenWrapper.userId)
    }


    @GetMapping(USER_DETAIL_URL)
    suspend fun getUser(@PathVariable userId : Int): UserModel? {
        return service.getUser(userId, loadDetails = true)
    }

    @GetMapping(USER_BASE_URL)
    @IsSuperuser
    suspend fun getAllUsers(@RequestParam(required = false) roles: List<String>?): Flow<UserDTO?> {
        return service.getAllUsers().map(mapper::mapModelToDTO)
    }

    @GetMapping(SEARCH_USER_URL)
    suspend fun searchUsers(@RequestParam roles: List<String>, name: String): Flow<UserDTO?> {
        return service.searchUsers(name, roles).map(mapper::mapModelToDTO)
    }

    @DeleteMapping(USER_DETAIL_URL)
    suspend fun deleteUser(@PathVariable(required = true) userId: Int): UserDTO {
        return mapper.mapModelToDTO(service.deleteUser(userId))
    }
}
