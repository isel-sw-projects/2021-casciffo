package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.states.StateRepository
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import isel.casciffo.casciffospringbackend.states.transitions.TransitionType
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
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
                .newTransition(existingAddenda.stateId!!, addenda.stateId!!, TransitionType.ADDENDA, addenda.id!!)
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
        addenda.stateTransitions = stateTransitionService.findAllByReferenceId(addenda.id!!).toList()
        return addenda
    }
}