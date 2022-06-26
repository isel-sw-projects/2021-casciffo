package isel.casciffo.casciffospringbackend.states

import isel.casciffo.casciffospringbackend.aggregates.state.StateAggregate
import isel.casciffo.casciffospringbackend.aggregates.state.StateAggregateRepo
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateException
import isel.casciffo.casciffospringbackend.roles.RoleService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.GroupedFlux
import reactor.core.publisher.Mono

@Service
class StateServiceImpl(
    @Autowired val stateRepository: StateRepository,
    @Autowired val stateAggregateRepo: StateAggregateRepo
): StateService {

    override suspend fun findByName(stateName: String): State {
        return stateRepository.findByName(stateName).awaitSingle()
    }

    override suspend fun findNextState(stateId: Int): Flow<State> {
        return stateRepository.findNextStatesById(stateId).asFlow()
    }

    override suspend fun findById(stateId: Int): State =
        stateRepository.findById(stateId).awaitSingle() ?: throw InvalidStateException()

    override suspend fun findAll(): Flow<State> {
        return mapToStateCoroutine(stateAggregateRepo.findAllStateAggregate()).asFlow()
    }

    override suspend fun findStateChainByType(type: StateType): Flow<State> {
        return mapToStateCoroutine(stateAggregateRepo.findStateChainByType(type)).asFlow()
    }

    private fun mapToState(stream: Flux<StateAggregate>) : Flux<State> {
//    TODO find way to not block
        return stream
            .groupBy { Pair(it.stateId!!, it.stateName!!) }
            .map { entry -> State(
                id = entry.key().first,
                name = entry.key().second,
                roles = Flux.from(entry.groupBy { it.roleName!! }.map { it.key() }),
                nextStates = Flux.from(mapNextStateInfo(entry)),
            )}
    }
    private suspend fun mapToStateCoroutine(stream: Flux<StateAggregate>) : List<State> {
        val list = stream.collectList().awaitSingleOrNull() ?: return listOf()
        return list
            .groupBy { Pair(it.stateId!!, it.stateName!!) }
            .map { entry -> State(
                id = entry.key.first,
                name = entry.key.second,
                roles = Flux.fromIterable(entry.value.groupBy { it.roleName!! }.map { it.key }),
                nextStates = Flux.fromIterable(mapNextStateInfoCoroutine(entry)),
            )}
    }


    private suspend fun mapNextStateInfoCoroutine(entry: Map.Entry<Pair<Int, String>, List<StateAggregate>>) =
        entry.value.groupBy { Pair(it.nextStateId, it.nextStateName) }
            .map { StateCoreInfo(it.key.first, it.key.second) }
    private fun mapNextStateInfo(entry: GroupedFlux<Pair<Int, String>, StateAggregate>) =
        entry.groupBy { Pair(it.nextStateId, it.nextStateName) }
            .flatMap { Mono.just(StateCoreInfo(it.key().first, it.key().second)) }

}