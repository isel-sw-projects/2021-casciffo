package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.aggregates.state_transition.StateTransitionAggregate
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.transitions.StateTransition
import org.springframework.stereotype.Component

@Component
class StateTransitionAggregateMapper: Mapper<StateTransition, StateTransitionAggregate> {
    override suspend fun mapDTOtoModel(dto: StateTransitionAggregate?): StateTransition {
        return if(dto == null) StateTransition()
        else StateTransition(
            id = dto.id,
            newStateId = dto.newStateId,
            previousStateId = dto.previousStateId,
            referenceId = dto.referenceId,
            transitionDate = dto.transitionDate,
            transitionType = dto.transitionType,
            newState = State(dto.newStateId, dto.newStateName),
            previousState = State(dto.previousStateId, dto.previousStateName)
        )
    }

    override suspend fun mapModelToDTO(model: StateTransition?): StateTransitionAggregate {
        throw NotImplementedError("Left blank on purpose")
    }
}