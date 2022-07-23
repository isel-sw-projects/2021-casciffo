package isel.casciffo.casciffospringbackend.states.state

import isel.casciffo.casciffospringbackend.aggregates.state.StateAggregate
import isel.casciffo.casciffospringbackend.aggregates.state.StateAggregateRepo
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateException
import isel.casciffo.casciffospringbackend.exceptions.InvalidStateTransitionException
import isel.casciffo.casciffospringbackend.exceptions.NotFullyValidatedException
import isel.casciffo.casciffospringbackend.roles.Roles
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

@Service
class StateServiceImpl(
    @Autowired val stateRepository: StateRepository,
    @Autowired val stateAggregateRepo: StateAggregateRepo
): StateService {

    override suspend fun findByName(stateName: String): State {
        return stateRepository.findByName(stateName).awaitSingle()
    }

    override suspend fun findNextState(stateId: Int, type: StateType): Flow<State> {
        return stateRepository.findNextStatesByIdAndStateType(stateId, type).asFlow()
    }

    override suspend fun getNextProposalState(pId: Int, type: StateType): State {
        return stateRepository.getNextProposalStateByIdAndStateType(pId, type)
            .awaitSingleOrNull() ?: throw IllegalStateException("No possible next state for proposal $pId")
    }

    override suspend fun findInitialStateByType(type: StateType): State =
        stateRepository.findInitialStateByType(type).awaitSingleOrNull() ?: throw InvalidStateException("Requested state doesn't exist.")


    override suspend fun findById(stateId: Int): State =
        //todo throw 400 if state is bad
        stateRepository.findById(stateId).awaitSingleOrNull() ?: throw InvalidStateException("Requested state doesn't exist.")

    override suspend fun verifyNextStateValid(originStateId: Int, nextStateId: Int, type: StateType, role: Roles)  {
        val nextState = stateAggregateRepo
            .findAggregateBy(originStateId, nextStateId, type)
            .collectList()
            .awaitSingleOrNull()

        if(nextState.isNullOrEmpty() || nextState.any { it.nextStateId == null }) {
            throw InvalidStateTransitionException("State transition isn't valid.")
        }

        if(nextState.none { it.roleName != role.name}) {
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