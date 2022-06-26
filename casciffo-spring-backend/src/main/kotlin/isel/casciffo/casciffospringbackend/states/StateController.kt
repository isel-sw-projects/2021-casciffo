package isel.casciffo.casciffospringbackend.states

import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.endpoints.STATES_CHAIN_TYPE_URL
import isel.casciffo.casciffospringbackend.endpoints.STATES_URL
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class StateController(
    @Autowired val stateService: StateService,
    @Autowired val mapper: Mapper<State, StateDTO>
) {
    @GetMapping(STATES_URL)
    suspend fun getAllStates(): Flow<StateDTO> {
        return stateService.findAll().map(mapper::mapModelToDTO)
    }

    @GetMapping(STATES_CHAIN_TYPE_URL)
    suspend fun getChainForType(@PathVariable(required = true) chainType: StateType): Flow<StateDTO> {
        return stateService.findStateChainByType(chainType).map(mapper::mapModelToDTO)
    }
}