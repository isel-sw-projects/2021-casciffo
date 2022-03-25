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
        return userRepository.save(user).awaitFirstOrNull()
    }

    private suspend fun loadRelations(user: User): User {
        user.role = roleRepository.findById(user.roleId!!).awaitFirstOrNull()
        return user
    }

//    private fun loadRelations(user: User): Mono<User?> {
//        // Load the role
//        return Mono.just(user)
//            .zipWith(roleRepository.findById(user.roleId!!))
//            .map {
//                it.t1.role = it.t2
//                return@map it.t1
//            }
//    }
}
