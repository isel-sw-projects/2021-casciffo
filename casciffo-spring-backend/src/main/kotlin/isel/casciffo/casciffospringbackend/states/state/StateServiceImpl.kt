package isel.casciffo.casciffospringbackend.states.state

import isel.casciffo.casciffospringbackend.aggregates.state.StateAggregate
import isel.casciffo.casciffospringbackend.aggregates.state.StateAggregateRepo
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateException
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.roles.Roles
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
        stateRepository.findById(stateId).awaitSingle() ?: throw InvalidStateException("State requested doesn't exist.")

    override suspend fun findAll(): Flow<State> {
        return mapToStateCoroutine(stateAggregateRepo.findAllStateAggregate()).asFlow()
    }

    override suspend fun findStateChainByType(type: StateType): Flow<State> {
        return mapToStateCoroutine(stateAggregateRepo.findStateChainByType(type)).asFlow()
    }

    override suspend fun verifyNextStateValid(originStateId: Int, nextStateId: Int, type: StateType, role: Roles)  {
        val nextState = stateAggregateRepo
            .findAggregateBy(originStateId, nextStateId, type)
            .collectList()
            .awaitSingleOrNull()

        if(nextState.isNullOrEmpty() || nextState.any { it.nextStateId == null }) {
            throw InvalidStateTransitionException("State transition isn't valid.")
        }

        if(nextState.any { it.roleName != role.name}) {
            throw InvalidStateTransitionException("You don't have the permissions to do this transition.")
        }
    }

    override suspend fun isTerminalState(stateId: Int, stateType: StateType): Boolean {
        return stateRepository.isTerminalState(stateId, stateType).awaitSingle()
    }

    private fun mapToState(stream: Flux<StateAggregate>) : Flux<State> {
//    TODO find a cleaner way
        return stream
            .groupBy { Pair(it.stateId!!, it.stateName!!) }
            .map { entry -> State(
                id = entry.key().first,
                name = entry.key().second,
                nextStates = Flux.from(mapNextStateInfo(entry)),
            )
            }
    }

    private suspend fun mapToStateCoroutine(stream: Flux<StateAggregate>) : List<State> {
        val list = stream.collectList().awaitSingleOrNull() ?: return listOf()
        return list
            .groupBy { Pair(it.stateId!!, it.stateName!!) }
            .map { entry -> State(
                id = entry.key.first,
                name = entry.key.second,
                nextStates = Flux.fromIterable(mapNextStateInfoCoroutine(entry)),
                roles = Flux.fromIterable(mapRoleName(entry))
            )
            }
    }

    private suspend fun mapRoleName(entry: Map.Entry<Pair<Int, String>, List<StateAggregate>>): Collection<String?> {
        return if(entry.value.first().roleName == null) listOf()
        else entry.value.groupBy { it.roleName }.keys
    }

    private suspend fun mapNextStateInfoCoroutine(entry: Map.Entry<Pair<Int, String>, List<StateAggregate>>): Collection<StateCoreInfo> {
        return if(entry.value.first().nextStateId == null)  listOf()
        else entry.value.groupBy { Pair(it.nextStateId, it.nextStateName) }
            .map { StateCoreInfo(it.key.first, it.key.second) }
    }


    private fun mapNextStateInfo(entry: GroupedFlux<Pair<Int, String>, StateAggregate>) =
        entry.groupBy { Pair(it.nextStateId, it.nextStateName) }
            .flatMap { Mono.just(StateCoreInfo(it.key().first, it.key().second)) }

}