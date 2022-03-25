package isel.casciffo.casciffospringbackend.users


import kotlinx.coroutines.flow.Flow
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserService {

    suspend fun getAllUsers() : Flow<User?>
    suspend fun getUser(id: Int) : User?
    suspend fun createUser(user: User) : User?
}