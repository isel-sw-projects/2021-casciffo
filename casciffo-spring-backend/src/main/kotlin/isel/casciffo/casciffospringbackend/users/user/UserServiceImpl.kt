package isel.casciffo.casciffospringbackend.users.user


import isel.casciffo.casciffospringbackend.aggregates.user.UserRolesAggregate
import isel.casciffo.casciffospringbackend.aggregates.user.UserRolesAggregateRepo
import isel.casciffo.casciffospringbackend.common.DEFAULT_PASSWORD
import isel.casciffo.casciffospringbackend.common.NotificationType
import isel.casciffo.casciffospringbackend.common.QuadTuple
import isel.casciffo.casciffospringbackend.common.ROLE_AUTH
import isel.casciffo.casciffospringbackend.exceptions.UserNotFoundException
import isel.casciffo.casciffospringbackend.roles.RoleModel
import isel.casciffo.casciffospringbackend.roles.RoleService
import isel.casciffo.casciffospringbackend.roles.Roles
import isel.casciffo.casciffospringbackend.security.BearerTokenWrapper
import isel.casciffo.casciffospringbackend.security.JwtSupport
import isel.casciffo.casciffospringbackend.users.notifications.NotificationModel
import isel.casciffo.casciffospringbackend.users.notifications.NotificationService
import isel.casciffo.casciffospringbackend.users.user_roles.UserRoles
import isel.casciffo.casciffospringbackend.users.user_roles.UserRolesRepo
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@Service
class UserServiceImpl(
    @Autowired val userRepository: UserRepository,
    @Autowired val userRolesRepo: UserRolesRepo,
    @Autowired val userRolesAggregateRepo: UserRolesAggregateRepo,
    @Autowired val roleService: RoleService,
    @Autowired private val encoder: PasswordEncoder,
    @Autowired val jwtSupport: JwtSupport,
    @Autowired val notificationService: NotificationService
) : UserService {

    val logger = KotlinLogging.logger {  }

    override suspend fun loginUser(userModel: UserModel): BearerTokenWrapper {
        val existingUser = findUserByEmail(userModel.email!!)


        existingUser?.let {
            if(!encoder.matches(userModel.password, it.password)) return@let

            val roles = if (existingUser.roles == null) null
            else existingUser.roles!!.map {r -> r.roleName!! }.collectList().awaitSingleOrNull()

            val token = jwtSupport.generate(it.email!!)
            return BearerTokenWrapper(token.value, existingUser.userId!!, existingUser.name!!, roles)
        }

        throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login credentials incorrect!")
    }

    override suspend fun findUserByEmail(email: String): UserModel? {
        return mapAggregateToModel(userRolesAggregateRepo.findByUserEmail(email), true)
            .awaitFirstOrNull()
            ?: throw UserNotFoundException()
    }

    override suspend fun notifyRoles(roles: List<Roles>, notificationModel: NotificationModel) {
        val users = getAllUsersByRoleNames(roles.map { it.name }).asFlux()
        notificationService.createBulkNotifications(
            users.map {
                NotificationModel(
                    userId = it.userId!!,
                    title = notificationModel.title,
                    description = notificationModel.description,
                    notificationType = notificationModel.notificationType,
                    ids = notificationModel.ids,
                    viewed = false
                )
            }
        )
    }

    private fun mapAggregateToModel(stream: Flux<UserRolesAggregate>, requirePassword: Boolean = false): Flux<UserModel> {
        return if(requirePassword)
            stream.groupBy { QuadTuple(it.userId!!, it.userName!!, it.userEmail!!, it.userPassword!!) }
                .map {
                    UserModel(
                        userId = it.key().first,
                        name = it.key().second,
                        email = it.key().third,
                        password = it.key().fourth,
                        roles = it.mapNotNull { role -> if (role.roleId == null ) null else RoleModel(roleId = role.roleId, roleName = role.roleName) })
                }
        else
            stream.groupBy { Triple(it.userId!!, it.userName!!, it.userEmail!!) }
                .map {
                    UserModel(
                        userId = it.key().first,
                        name = it.key().second,
                        email = it.key().third,
                        roles = it.mapNotNull { role -> if (role.roleId == null ) null else RoleModel(roleId = role.roleId, roleName = role.roleName) })
                }
    }

    override suspend fun deleteUser(userId: Int): UserModel {
        val deletedUser = getUser(userId)!!
        userRepository.deleteById(userId).subscribe()
        return deletedUser
    }

    override suspend fun updateUserRoles(roles: List<Int>, userId: Int): UserModel {
        if (roles.isEmpty()) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Roles cannot come empty!")

        val user = getUser(userId, true)!!
        val currentRoles = user.roles?.collectList()?.awaitFirstOrNull()
        val rolesToAdd =
            if (!currentRoles.isNullOrEmpty())
                roles.filter { r -> !currentRoles.any { cr -> r == cr.roleId!! } }
            else
                roles

        if(rolesToAdd.isEmpty()) return user

        userRolesRepo
            .saveAll(rolesToAdd.map { UserRoles(userId = userId, roleId = it) })
            .doOnError {
                logger.info { it }
            }.subscribe()

        val updatedRoles = roleService.findByUserId(userId).map { it.roleName!! }.collectList().awaitSingle()

        notificationService.createNotification(userId,
            NotificationModel(
                title = "Novos papéis adicionados.",
                description = "Papéis novos:\n\t " + updatedRoles.joinToString(", ") + ".",
                notificationType = NotificationType.USER_NEW_ROLES
            )
        )
        return getUser(userId, true)!!
    }



    override suspend fun getAllUsers(): Flow<UserModel?> {
        return mapAggregateToModel(userRolesAggregateRepo.findAllUsersAndRoles())
            .asFlow()
    }

    override suspend fun getUser(id: Int, loadDetails: Boolean): UserModel? {
        return mapAggregateToModel(userRolesAggregateRepo.findByUserId(id))
            .awaitFirstOrNull()
            ?: throw UserNotFoundException()
    }

    override suspend fun createNewUser(model: UserModel): UserModel {

        model.password = encoder.encode(
            if(model.password != null) model.password
            else DEFAULT_PASSWORD
        )
        return  userRepository.save(model).awaitSingleOrNull()
                        ?: throw ResponseStatusException(HttpStatus.I_AM_A_TEAPOT, "¯\\_(ツ)_/¯")
    }

    @Transactional
    override suspend fun registerUser(userModel: UserModel): BearerTokenWrapper {
        userModel.password = encoder.encode(userModel.password)

        val user = userRepository.save(userModel).awaitSingleOrNull()
                ?: throw ResponseStatusException(HttpStatus.I_AM_A_TEAPOT, "¯\\_(ツ)_/¯")

        return BearerTokenWrapper(
            token = jwtSupport.generate(user.email!!).value,
            userId = user.userId!!,
            userName = user.name!!
        )
    }

    override suspend fun getAllUsersByRoleNames(roles: List<String>): Flow<UserModel> {
        return userRepository.findAllByRoleNameIsIn(roles).asFlow()
    }

    override suspend fun searchUsers(name: String, roles: List<String>): Flow<UserModel?> {
        //% is added to make query (SELECT ... WHERE name LIKE %abc% AND ...)
        //adding % to the query itself (in the repository) will break the statement and throw runtime db exception
        return if (roles.isEmpty())
            userRepository.findAllByNameIsLike(name).asFlow()
        else
            userRepository
                .findAllByRoleNameIsInAndNameLike("%$name%", roles.map { it.uppercase() })
                .asFlow()
    }

    /**
     * This method is used by spring security
     * Currently passing the user email on the arg username, since username is not unique
     */
    override fun findByUsername(username: String?): Mono<UserDetails> {
        //leaving it like this for now to avoid confusion
        val email = username
        if(email === null)
            throw org.springframework.security.core.userdetails.UsernameNotFoundException("User email can't be null!!!")

        return userRepository.findByEmail(email)
            .switchIfEmpty(
                Mono.error(
                    org.springframework.security.core.userdetails.UsernameNotFoundException("User email can't be null!!!")
                ))
            .flatMap(this::buildUserDetails)
    }

    /**
     * This method will load the role and build the UserDetails to be used by spring security
     */
    private fun buildUserDetails(userModel: UserModel): Mono<UserDetails> {
        return roleService
            .findByUserId(userModel.userId!!)
            .collectList()
            .map { it ->
                val authorities = it.map { SimpleGrantedAuthority("$ROLE_AUTH${it.roleName}") }
                User(userModel.email, userModel.password, authorities)
            }
    }
}
