package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.endpoints.*
import isel.casciffo.casciffospringbackend.security.JwtDTO
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
class UserController(@Autowired val service : UserService) {

    @PostMapping(REGISTER_URL)
    @ResponseStatus(HttpStatus.CREATED)
    suspend fun createUser(@RequestBody(required = true) userModel: UserModel): JwtDTO {
        val token = service.createUser(userModel)
        return JwtDTO(token.value)
    }

    @PostMapping(LOGIN_URL)
    suspend fun loginUser(@RequestBody(required = true) userModel: UserModel): JwtDTO {
        return JwtDTO(service.loginUser(userModel).value)
    }


    @GetMapping(GET_USER_URL)
    suspend fun getUser(@PathVariable userId : Int): UserModel? {
        return service.getUser(userId)
    }

    @GetMapping(USER_BASE_URL)
    @PreAuthorize("hasRole('SUPERUSER')")
    suspend fun getAllUsers(@RequestParam(required = false) roles: List<String>?): Flow<UserModel?> {
        return service.getAllUsers()
    }

    @GetMapping(SEARCH_USER_URL)
    suspend fun searchUsers(@RequestParam roles: List<String>, name: String): Flow<UserModel?> {
        return service.searchUsers(name, roles)
    }
}
