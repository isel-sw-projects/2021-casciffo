package isel.casciffo.casciffospringbackend.states.transitions

import isel.casciffo.casciffospringbackend.aggregates.state_transition.StateTransitionAggregate
import isel.casciffo.casciffospringbackend.aggregates.state_transition.StateTransitionAggregateRepo
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.states.state.StateService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class StateTransitionServiceImpl(
    @Autowired val stateTransitionRepository: StateTransitionRepository,
    @Autowired val stateTransitionAggregateRepo: StateTransitionAggregateRepo,
    @Autowired val mapper : Mapper<StateTransition, StateTransitionAggregate>,
    @Autowired val stateService: StateService
): StateTransitionService {
    override suspend fun newTransition(
        oldStateId: Int,
        newStateId: Int,
        stateType: StateType,
        referenceId: Int
    ): Boolean {
        val stateTransition =
            StateTransition(
                null
                , oldStateId
                , newStateId
                , LocalDateTime.now()
                , stateType
                , referenceId
            )
        stateTransitionRepository.save(stateTransition).awaitFirstOrNull() ?: return false
        return true
    }

    override suspend fun findAllByReferenceId(id: Int, type: StateType): Flow<StateTransition> {
        return stateTransitionAggregateRepo
            .findAllByReferenceIdAndTransitionType(id, type)
            .asFlow()
            .map(mapper::mapDTOtoModel)
    }
}