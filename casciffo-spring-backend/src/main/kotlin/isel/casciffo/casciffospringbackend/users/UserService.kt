package isel.casciffo.casciffospringbackend.users


import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserService {

    suspend fun getAllUsers() : Flow<User?>
    suspend fun getUser(id: Int) : User?
    suspend fun createUser(user: User) : User?
    suspend fun verifyCredentials(userId: Int, password: String): Boolean
    suspend fun getAllUsersByRoleNames(roles: List<String>): Flow<User?>
    suspend fun searchUsers(name: String, roles: List<String>): Flow<User?>
}