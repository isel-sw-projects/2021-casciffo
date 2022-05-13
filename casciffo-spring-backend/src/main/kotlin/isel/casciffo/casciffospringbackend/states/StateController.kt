package isel.casciffo.casciffospringbackend.states

import isel.casciffo.casciffospringbackend.util.STATES_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class StateController(
    @Autowired val stateService: StateService
) {
    @GetMapping(STATES_URL)
    suspend fun getAllStates(): Flow<State> {
        return stateService.findAll()
    }
}