package isel.casciffo.casciffospringbackend.users

import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(@Autowired val service : UserService) {

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    suspend fun createUser(@RequestBody(required = true) user: User): User? {
        return service.createUser(user)
    }

    @GetMapping("/{userId}")
    suspend fun getUser(@PathVariable userId : Int): User? {
        return service.getUser(userId)
    }

    @GetMapping
    suspend fun getAllUsers(@RequestParam(required = false) roles: List<String>?): Flow<User?> {
        return service.getAllUsers()
    }

    @GetMapping("/search")
    suspend fun searchUsers(@RequestParam roles: List<String>, name: String): Flow<User?> {
        return service.searchUsers(name, roles)
    }
}
