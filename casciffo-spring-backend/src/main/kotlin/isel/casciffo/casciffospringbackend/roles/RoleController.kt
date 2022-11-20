package isel.casciffo.casciffospringbackend.roles

import isel.casciffo.casciffospringbackend.endpoints.ROLES_URL
import isel.casciffo.casciffospringbackend.endpoints.ROLE_DELETE_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
class RoleController(@Autowired val service: RoleService) {

    @PostMapping(ROLES_URL)
    @ResponseStatus(HttpStatus.CREATED)
    suspend fun createUserRole(@RequestBody role: RoleModel) : RoleModel? {
        return service.createRole(role)
    }

    @GetMapping(ROLES_URL)
    suspend fun getUserRoles() : Flow<RoleModel> {
        return service.getRoles()
    }

    @DeleteMapping(ROLE_DELETE_URL)
    suspend fun deleteRole(@PathVariable roleId: Int): RoleModel {
        return service.deleteRole(roleId)
    }
}