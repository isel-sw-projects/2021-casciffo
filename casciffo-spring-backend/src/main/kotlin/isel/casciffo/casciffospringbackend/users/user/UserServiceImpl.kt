package isel.casciffo.casciffospringbackend.users.user


import isel.casciffo.casciffospringbackend.aggregates.user.UserRolesAggregate
import isel.casciffo.casciffospringbackend.aggregates.user.UserRolesAggregateRepo
import isel.casciffo.casciffospringbackend.common.*
import isel.casciffo.casciffospringbackend.exceptions.UserNotFoundException
import isel.casciffo.casciffospringbackend.roles.RoleModel
import isel.casciffo.casciffospringbackend.roles.RoleService
import isel.casciffo.casciffospringbackend.roles.Roles
import isel.casciffo.casciffospringbackend.security.BearerToken
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
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

//TODO CHANGE REPOSITORIES TO SERVICES
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

    override suspend fun getUserRolesFromRequest(request: ServerHttpRequest): List<String> {
        val token = request.headers.getFirst(HttpHeaders.AUTHORIZATION)!!
        val bearer = BearerToken(token.substringAfter("Bearer "))
        val userEmail = jwtSupport.getUserEmail(bearer)
        val user = findUserByEmail(userEmail)!!
        return user.roles!!.map { it.roleName!! }.collectList().awaitSingle()
    }

    override suspend fun loginUser(userModel: UserModel): BearerTokenWrapper {
        val existingUser = findUserByEmail(userModel.email!!)
            ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais incorretas!")

        if(!encoder.matches(userModel.password, existingUser.password))
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais incorretas!")

        val roles = if (existingUser.roles == null) null
        else existingUser.roles!!.map {r -> r.roleName!! }.collectList().awaitSingleOrNull()

        val token = jwtSupport.generate(existingUser.email!!)
        return BearerTokenWrapper(token.value, existingUser.userId!!, existingUser.name!!, roles)
    }

    override suspend fun findUserByEmail(email: String): UserModel? {
        return mapAggregateToModel(userRolesAggregateRepo.findByUserEmail(email), true)
            .awaitFirstOrNull()
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
        userRepository.deleteById(userId).awaitSingleOrNull()
        return deletedUser
    }

    override suspend fun updateUserRoles(roles: List<Int>, userId: Int): UserModel {
        val user = getUser(userId) ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Utilizador com id [$userId] não existe!")

        if (roles.isEmpty()) return user

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
        return getUser(userId)!!
    }

    override suspend fun deleteUserRoles(roleIds: List<Int>, userId: Int): UserModel {
        val userExists = userRepository.existsById(userId).awaitSingle()
        if(!userExists) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Utilizador com id [$userId] não existe!")
        userRolesRepo.deleteUserRolesByUserIdAndRoleIdIn(userId, roleIds).awaitSingleOrNull()
        return getUser(userId)!!
    }



    override suspend fun getAllUsers(): Flow<UserModel?> {
        return mapAggregateToModel(userRolesAggregateRepo.findAllUsersAndRoles())
            .asFlow()
    }

    override suspend fun getUser(id: Int): UserModel? {
        return mapAggregateToModel(userRolesAggregateRepo.findByUserId(id))
            .awaitFirstOrNull()
            ?: throw UserNotFoundException()
    }

    override suspend fun createNewUser(model: UserModel): UserModel {
        val exists = findUserByEmail(model.email!!)
        if(exists != null) throw ResponseStatusException(HttpStatus.CONFLICT, "O email introduzido já existe, tem de usar um email único!")
        model.password = encoder.encode(
            if(model.password != null) model.password
            else DEFAULT_PASSWORD
        )
        val newUser = userRepository.save(model).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.I_AM_A_TEAPOT, "¯\\_(ツ)_/¯")
        notificationService.createNotification(newUser.userId!!,
            NotificationModel(
                title = "Conta criada",
                description = "A tua conta foi criada! Podes alterar a password no teu perfil ao clicar no botão superior direito.",
                notificationType = NotificationType.USER_CREATED,
                ids = convertToJson(listOf(Pair("userId", newUser.userId!!))),
                viewed = false
            )
        )
        return newUser
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
            throw org.springframework.security.core.userdetails.UsernameNotFoundException("É obrigatório ter Email!")

        return userRepository.findByEmail(email)
            .switchIfEmpty(
                Mono.error(
                    org.springframework.security.core.userdetails.UsernameNotFoundException("É obrigatório ter Email!")
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
