package isel.casciffo.casciffospringbackend.users

import isel.casciffo.casciffospringbackend.exceptions.UserNotFoundException
import isel.casciffo.casciffospringbackend.roles.UserRoleRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@Service
class UserServiceImpl(@Autowired val userRepository: UserRepository,
                      @Autowired val roleRepository: UserRoleRepository) : UserService {

        override fun getAllUsers(): Flux<User?>  {
            return userRepository.findAll()
                .flatMap(this::loadRelations)
        }

        override fun getUser(id: Int): Mono<User?> {
            return userRepository.findById(id)
                .flatMap(this::loadRelations)
                .switchIfEmpty(Mono.error(UserNotFoundException()))
        }

        @Transactional
        override fun createUser(user: User): Mono<User?> {
            //TODO ENCRYPT PASSWORD !!!DO NOT SAVE CLEAR PASSWORD!!!
            return userRepository.save(user).map {
                return@map it
            }
        }
    private fun loadRelations(user: User): Mono<User?> {
        // Load the role
        return Mono.just(user)
            .zipWith(roleRepository.findById(user.roleId!!))
            .map {
                it.t1.role = it.t2
                return@map it.t1
            }
    }
}
