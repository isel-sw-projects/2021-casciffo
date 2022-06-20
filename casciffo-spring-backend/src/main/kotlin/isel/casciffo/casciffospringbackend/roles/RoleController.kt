package isel.casciffo.casciffospringbackend.roles

import isel.casciffo.casciffospringbackend.endpoints.ROLE_BASE_URL
import isel.casciffo.casciffospringbackend.endpoints.ROLE_DELETE_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
class RoleController(@Autowired val service: RoleService) {

    @PostMapping(ROLE_BASE_URL)
    @ResponseStatus(HttpStatus.CREATED)
    suspend fun createUserRole(@RequestBody(required = true) role: Role) : Role? {
        return service.createRole(role)
    }

    @GetMapping(ROLE_BASE_URL)
    suspend fun getUserRoles() : Flow<Role> {
        return service.getRoles()
    }

    @DeleteMapping(ROLE_DELETE_URL)
    suspend fun deleteRole(@PathVariable(required = true) roleId: Int): Role {
        return service.deleteRole(roleId)
    }
}