package isel.casciffo.casciffospringbackend.roles

import isel.casciffo.casciffospringbackend.util.USER_ROLE_BASE_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
class UserRoleController(@Autowired val service: UserRoleService) {

    @PostMapping(USER_ROLE_BASE_URL)
    @ResponseStatus(HttpStatus.CREATED)
    suspend fun createUserRole(@RequestBody(required = true) role: UserRole) : UserRole? {
        return service.createRole(role)
    }

    @GetMapping(USER_ROLE_BASE_URL)
    suspend fun getUserRoles() : Flow<UserRole> {
        return service.getRoles()
    }
}