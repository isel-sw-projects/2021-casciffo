package isel.casciffo.casciffospringbackend.mappers

import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.state.StateDTO
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Component

@Component
class StateMapper: Mapper<State, StateDTO> {
    override suspend fun mapDTOtoModel(dto: StateDTO?): State {
        throw NotImplementedError("Left blank on purpose.")
    }

    override suspend fun mapModelToDTO(model: State?): StateDTO {
        if(model == null) return StateDTO()
        return StateDTO(
            id = model.id,
            stateName = model.name,
            nextInChain = model.nextStates?.collectList()?.awaitSingleOrNull(),
            roles = model.roles!!.collectList().awaitSingleOrNull(),
            stateFlowType = model.stateFlowType!!
        )
    }
}