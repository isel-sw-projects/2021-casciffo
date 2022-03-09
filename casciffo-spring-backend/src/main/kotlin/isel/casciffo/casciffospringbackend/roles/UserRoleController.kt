package isel.casciffo.casciffospringbackend.roles

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
    fun createUserRole(@RequestBody(required = true) role: String) : Mono<UserRole?> {
        return service.createRole(role)
    }

    @GetMapping
    fun getUserRoles() : Flux<UserRole> {
        return service.getRoles()
    }
}