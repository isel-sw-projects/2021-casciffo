package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.exceptions.UserNotFoundException
import isel.casciffo.casciffospringbackend.roles.UserRoleRepository
import kotlinx.coroutines.flow.Flow
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
                      @Autowired val roleRepository: UserRoleRepository) : UserService {

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

    private suspend fun loadRelations(user: User): User {
        user.role = roleRepository.findById(user.roleId!!).awaitFirstOrNull()
        return user
    }
}
