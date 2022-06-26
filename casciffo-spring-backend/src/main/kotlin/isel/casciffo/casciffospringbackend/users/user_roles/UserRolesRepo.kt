package isel.casciffo.casciffospringbackend.users.user_roles

import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface UserRolesRepo : ReactiveCrudRepository<UserRoles, Int>