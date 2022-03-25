package isel.casciffo.casciffospringbackend.roles

import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/roles")
class UserRoleController(@Autowired val service: UserRoleService) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    suspend fun createUserRole(@RequestBody(required = true) role: String) : UserRole? {
        return service.createRole(role)
    }

    @GetMapping
    suspend fun getUserRoles() : Flow<UserRole> {
        return service.getRoles()
    }
}