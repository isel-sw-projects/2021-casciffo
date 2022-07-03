package isel.casciffo.casciffospringbackend.states.state

import isel.casciffo.casciffospringbackend.aggregates.state.StateAggregate
import isel.casciffo.casciffospringbackend.aggregates.state.StateAggregateRepo
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateException
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.roles.Roles
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.ConnectableFlux
import reactor.core.publisher.Flux

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

    override suspend fun findAll(): Flow<State> {
        return mapToState(stateAggregateRepo.findAllStateAggregate()).asFlow()
    }

    override suspend fun findStateChainByType(type: StateType): Flow<State> {
        return mapToState(stateAggregateRepo.findStateChainByType(type)).asFlow()
    }

    override suspend fun isTerminalState(stateId: Int, stateType: StateType): Boolean {
        return stateRepository.isTerminalState(stateId, stateType).awaitSingle()
    }

    private fun mapToState(stream: Flux<StateAggregate>) : Flux<State> {
        runBlocking {
            stream.collectList().subscribe {
                println(it)
            }
        }
        return stream
            .groupBy { Triple(it.stateId!!, it.stateName!!, it.stateFlowType!!) }
            .map { entry ->
                val replayableEntry = entry.cache()
                State(id = entry.key().first,
                    name = entry.key().second,
                    stateFlowType = entry.key().third,
                    nextStates = mapNextStateInfo(replayableEntry),
                    roles = mapRoleName(replayableEntry))
            }
    }

    private fun mapNextStateInfo(entry: Flux<StateAggregate>) =
        entry.groupBy { Pair(it.nextStateId, it.nextStateName) }
            .map { StateCoreInfo(it.key().first, it.key().second) }
    private fun mapRoleName(entry: Flux<StateAggregate>) =
        entry.filter{it.roleName != null}.groupBy { it.roleName!! }.map { it.key() }

}