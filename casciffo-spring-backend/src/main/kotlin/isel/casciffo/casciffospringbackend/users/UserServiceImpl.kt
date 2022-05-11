package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.exceptions.UserNotFoundException
import isel.casciffo.casciffospringbackend.roles.UserRoleRepository
import isel.casciffo.casciffospringbackend.roles.UserRoleService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.*


@Service
class UserServiceImpl(@Autowired val userRepository: UserRepository,
                      @Autowired val roleService: UserRoleService) : UserService {

    override suspend fun getAllUsers(): Flow<User?> {
        return userRepository.findAll().asFlow().onEach(this::loadRelations)
    }

    override suspend fun getUser(id: Int): User? {
        val user = userRepository.findById(id).awaitFirstOrNull()
            ?: throw UserNotFoundException()

        return loadRelations(user)
    }

    @Transactional
    override suspend fun createUser(user: User): User? {
        user.password = Base64.getEncoder().encodeToString("CASCIFFO//".plus(user.password).toByteArray())
        return userRepository.save(user).awaitFirstOrNull()
    }

    override suspend fun verifyCredentials(userId: Int, password: String): Boolean {
        val user = userRepository.findById(userId).awaitFirstOrNull() ?: return false
        //compares encryption........ maybe should decrypt?
        return user.password == password
    }

    override suspend fun getAllUsersByRoleNames(roles: List<String>): Flow<User?> {
        return userRepository.findAllByRoleNameIsIn(roles).asFlow()
    }

    override suspend fun searchUsers(name: String, roles: List<String>): Flow<User?> {
        //% is added to make query (SELECT ... WHERE name LIKE abc% AND ...)
        //adding % to the query itself will break the statement and throw runtime db exception
        return userRepository.findAllByRoleNameIsInAndNameLike(name.plus('%'), roles).asFlow()
    }

    private suspend fun loadRelations(user: User): User {
        user.role = roleService.findById(user.roleId!!)
        return user
    }
}
