package isel.casciffo.casciffospringbackend.users


import isel.casciffo.casciffospringbackend.security.BearerTokenWrapper
import kotlinx.coroutines.flow.Flow
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.core.userdetails.UserDetails
import reactor.core.publisher.Mono

interface UserService: ReactiveUserDetailsService {

    override fun findByUsername(username: String?): Mono<UserDetails>
    suspend fun getAllUsers() : Flow<UserModel?>
    suspend fun getUser(id: Int, loadDetails: Boolean = false) : UserModel?
    suspend fun registerUser(userModel: UserModel) : BearerTokenWrapper
    suspend fun getAllUsersByRoleNames(roles: List<String>): Flow<UserModel?>
    suspend fun searchUsers(name: String, roles: List<String>): Flow<UserModel?>
    suspend fun loginUser(userModel: UserModel): BearerTokenWrapper

    suspend fun deleteUser(userId: Int): UserModel
    suspend fun updateUserRoles(roles: List<Int>, userId: Int)
}