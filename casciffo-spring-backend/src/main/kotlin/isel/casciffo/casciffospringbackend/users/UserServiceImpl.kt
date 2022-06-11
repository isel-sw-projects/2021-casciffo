package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.exceptions.UserNotFoundException
import isel.casciffo.casciffospringbackend.roles.UserRoleService
import isel.casciffo.casciffospringbackend.security.BearerToken
import isel.casciffo.casciffospringbackend.security.JwtDTO
import isel.casciffo.casciffospringbackend.security.JwtSupport
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import lombok.extern.slf4j.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono
import java.util.*


@Service
@Slf4j
class UserServiceImpl(
    @Autowired val userRepository: UserRepository,
    @Autowired val roleService: UserRoleService,
    @Autowired private val encoder: PasswordEncoder,
    @Autowired val jwtSupport: JwtSupport
) : UserService {

    override suspend fun loginUser(userModel: UserModel): BearerToken {
        val existingUser = userRepository.findByEmail(userModel.email!!).awaitSingleOrNull()

        existingUser?.let {
            if(encoder.matches(userModel.password, it.password))
                return jwtSupport.generate(it.email!!)
        }

        throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login credentials incorrect!")
    }

    override suspend fun getAllUsers(): Flow<UserModel?> {
        return userRepository.findAll().asFlow().onEach(this::loadRelations)
    }

    override suspend fun getUser(id: Int): UserModel? {
        val user = userRepository.findById(id).awaitFirstOrNull()
            ?: throw UserNotFoundException()

        return loadRelations(user)
    }

    @Transactional
    override suspend fun createUser(userModel: UserModel): BearerToken {
        userModel.password = encoder.encode(userModel.password)
        val user = userRepository.save(userModel).awaitSingleOrNull() ?: throw ResponseStatusException(HttpStatus.I_AM_A_TEAPOT, "¯\\_(ツ)_/¯")
        return jwtSupport.generate(user.email!!)
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
        userModel.role = roleService.findById(userModel.roleId!!)
        return userModel
    }

    /**
     * This method pertain to spring security configuration
     */
    override fun findByUsername(username: String?): Mono<UserDetails> {
        if(username === null)
            throw org.springframework.security.core.userdetails.UsernameNotFoundException("username cant be null!!!")

        return userRepository.findByName(username)
            .switchIfEmpty(
                Mono.error(
                    org.springframework.security.core.userdetails.UsernameNotFoundException("username cant be null!!!")
                ))
            .flatMap(this::buildUserDetails)
    }

    /**
     * This method will load the role and build the UserDetails to be used by spring security
     */
    private fun buildUserDetails(userModel: UserModel): Mono<org.springframework.security.core.userdetails.User> {
        return roleService.findByIdMono(userModel.roleId!!)
            .map{
                userModel.role = it
                userModel
            }.map {
                val authorities = listOf(SimpleGrantedAuthority(it.role!!.roleName))
                org.springframework.security.core.userdetails.User(it.name, it.password, authorities)
            }
    }
}
