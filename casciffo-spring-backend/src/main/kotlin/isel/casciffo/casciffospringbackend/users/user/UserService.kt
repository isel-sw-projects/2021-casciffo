package isel.casciffo.casciffospringbackend.users.user


import isel.casciffo.casciffospringbackend.roles.Roles
import isel.casciffo.casciffospringbackend.security.BearerTokenWrapper
import isel.casciffo.casciffospringbackend.users.notifications.NotificationModel
import kotlinx.coroutines.flow.Flow
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.core.userdetails.UserDetails
import reactor.core.publisher.Mono

interface UserService: ReactiveUserDetailsService {

    override fun findByUsername(username: String?): Mono<UserDetails>
    suspend fun getAllUsers() : Flow<UserModel?>
    suspend fun getUser(id: Int) : UserModel?
    suspend fun registerUser(userModel: UserModel) : BearerTokenWrapper
    suspend fun getAllUsersByRoleNames(roles: List<String>): Flow<UserModel>
    suspend fun searchUsers(name: String, roles: List<String>): Flow<UserModel?>
    suspend fun loginUser(userModel: UserModel): BearerTokenWrapper

    suspend fun findUserByEmail(email: String): UserModel?

    /**
     * Notifies all users with the roles in [roles].
     * @param roles Roles to be notified.
     * @param notificationModel Notification to be sent, it will be duplicated and incoming [NotificationModel]#userId is ignored.
     */
    suspend fun notifyRoles(roles: List<Roles>, notificationModel: NotificationModel)

    suspend fun deleteUser(userId: Int): UserModel
    suspend fun updateUserRoles(roles: List<Int>, userId: Int): UserModel
    suspend fun deleteUserRoles(roleIds: List<Int>, userId: Int): UserModel
    suspend fun createNewUser(model: UserModel): UserModel
}