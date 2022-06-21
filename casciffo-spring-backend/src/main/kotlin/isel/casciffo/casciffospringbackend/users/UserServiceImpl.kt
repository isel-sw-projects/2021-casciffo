package isel.casciffo.casciffospringbackend.users


import isel.casciffo.casciffospringbackend.aggregates.user.UserRoles
import isel.casciffo.casciffospringbackend.aggregates.user.UserRolesRepo
import isel.casciffo.casciffospringbackend.common.ROLE_AUTH
import isel.casciffo.casciffospringbackend.exceptions.UserNotFoundException
import isel.casciffo.casciffospringbackend.roles.RoleService
import isel.casciffo.casciffospringbackend.security.BearerTokenWrapper
import isel.casciffo.casciffospringbackend.security.JwtSupport
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono


@Service
class UserServiceImpl(
    @Autowired val userRepository: UserRepository,
    @Autowired val roleService: RoleService,
    @Autowired private val encoder: PasswordEncoder,
    @Autowired val jwtSupport: JwtSupport,
    @Autowired val userRolesRepo: UserRolesRepo
) : UserService {

    override suspend fun loginUser(userModel: UserModel): BearerTokenWrapper {
        val existingUser = userRepository.findByEmail(userModel.email!!).awaitSingleOrNull()

        existingUser?.let {
            if(encoder.matches(userModel.password, it.password))
                return BearerTokenWrapper(jwtSupport.generate(it.email!!), existingUser.userId!!)
        }

        throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login credentials incorrect!")
    }

    override suspend fun deleteUser(userId: Int): UserModel {
        val deletedUser = getUser(userId)!!
        userRepository.deleteById(userId).subscribe()
        return deletedUser
    }

    override suspend fun getAllUsers(): Flow<UserModel?> {
        return userRepository.findAll().asFlow().onEach(this::loadRelations)
    }

    override suspend fun getUser(id: Int, loadDetails: Boolean): UserModel? {
        val user = userRepository.findById(id).awaitFirstOrNull()
            ?: throw UserNotFoundException()

        return if(loadDetails) loadRelations(user) else user
    }

    @Transactional
    override suspend fun registerUser(userModel: UserModel): BearerTokenWrapper {
        userModel.password = encoder.encode(userModel.password)
        val user = userRepository.save(userModel).awaitSingleOrNull()
                ?: throw ResponseStatusException(HttpStatus.I_AM_A_TEAPOT, "¯\\_(ツ)_/¯")

        val roles = userRolesRepo
            .saveAll(
                userModel.roles!!
                    .map {
                        UserRoles(user_id = user.userId, role_id = it.roleId)
                    }
            ).collectList().awaitSingle()
        return BearerTokenWrapper(jwtSupport.generate(user.email!!), user.userId!!)
    }

    override suspend fun getAllUsersByRoleNames(roles: List<String>): Flow<UserModel?> {
        return userRepository.findAllByRoleNameIsIn(roles).asFlow()
    }

    override suspend fun searchUsers(name: String, roles: List<String>): Flow<UserModel?> {
        //% is added to make query (SELECT ... WHERE name LIKE abc% AND ...)
        //adding % to the query itself will break the statement and throw runtime db exception
        return userRepository.findAllByRoleNameIsInAndNameLike(name.plus('%'), roles).asFlow()
    }

    private suspend fun loadRelations(userModel: UserModel): UserModel {
        //publisher is used during mapping to DTO
        userModel.roles = roleService.findByUserId(userModel.userId!!)
        return userModel
    }

    /**
     * This method pertain to spring security configuration
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
