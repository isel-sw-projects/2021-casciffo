package isel.casciffo.casciffospringbackend.aggregates.user

import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface UserRolesRepo : ReactiveCrudRepository<UserRoles, Int>