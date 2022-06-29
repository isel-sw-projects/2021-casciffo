package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.states.state.StateRepository
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import isel.casciffo.casciffospringbackend.common.StateType
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.asFlux
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AddendaServiceImpl(
    @Autowired val addendaRepository: AddendaRepository,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val stateRepository: StateRepository
): AddendaService {
    override suspend fun createAddenda(addenda: Addenda): Addenda {
        return addendaRepository.save(addenda).awaitFirst()
    }

    override suspend fun updateAddenda(addenda: Addenda): Addenda {
        val existingAddenda = addendaRepository.findById(addenda.id!!).awaitFirstOrNull()
            ?: throw IllegalArgumentException("Proposal doesnt exist!!!")
        val hasStateTransitioned = addenda.stateId == existingAddenda.stateId

        if(hasStateTransitioned) {
            stateTransitionService
                .newTransition(existingAddenda.stateId!!, addenda.stateId!!, StateType.ADDENDA, addenda.id!!)
        }

        return addendaRepository.save(addenda).awaitFirstOrNull() ?: throw Exception("Idk what happened bro ngl")
    }

    override suspend fun getAddendaByResearchId(researchId: Int): Addenda {
        val addenda = addendaRepository.findByResearchId(researchId).awaitFirstOrNull()
            ?: throw IllegalArgumentException("No addenda found for the specified researchId")
        return loadRelations(addenda)
    }

    suspend fun loadRelations(addenda: Addenda) : Addenda {
        addenda.state = stateRepository.findById(addenda.stateId!!).awaitFirstOrNull()
        addenda.stateTransitions = stateTransitionService.findAllByReferenceId(addenda.id!!).asFlux()
        return addenda
    }
}