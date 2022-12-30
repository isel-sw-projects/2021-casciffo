package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.aggregates.addenda.AddendaAggregateRepo
import isel.casciffo.casciffospringbackend.common.StateType
import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaCommentService
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.state.StateRepository
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux

@Service
class AddendaServiceImpl(
    @Autowired val addendaRepository: AddendaRepository,
    @Autowired val addendaAggregateRepo: AddendaAggregateRepo,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val addendaCommentService: AddendaCommentService
): AddendaService {
    override suspend fun createAddenda(addenda: Addenda): Addenda {
        return addendaRepository.save(addenda).awaitFirst()
    }

    override suspend fun updateAddenda(addenda: Addenda): Addenda {
        val existingAddenda = addendaRepository.findById(addenda.id!!).awaitFirstOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Adenda não existe!")
        val hasStateTransitioned = addenda.stateId == existingAddenda.stateId

        if(hasStateTransitioned) {
            stateTransitionService
                .newTransition(existingAddenda.stateId!!, addenda.stateId!!, StateType.ADDENDA, addenda.id!!)
        }

        return addendaRepository.save(addenda).awaitFirstOrNull() ?: throw Exception("Idk what happened bro ngl")
    }

    override suspend fun getAddendaByResearchId(researchId: Int): Flux<Addenda> {
        return addendaAggregateRepo.findAllByResearchId(researchId)
            .map {
                Addenda(
                    id = it.id,
                    researchId = researchId,
                    stateId = it.stateId,
                    fileId = it.fileId,
                    createdDate = it.createdDate,
                    state = State(id = it.stateId, name = it.stateName),
                    fileInfo = FileInfo(
                        id = it.fileId,
                        fileName = it.fileName,
                        fileSize = it.fileSize,
                        filePath = it.filePath
                    )
                )
            }
    }

    override suspend fun getAddendaDetails(addendaId: Int): Addenda {
        val addenda = addendaAggregateRepo.findById(addendaId)
            .map {
                Addenda(
                    id = it.id,
                    researchId = it.researchId,
                    stateId = it.stateId,
                    fileId = it.fileId,
                    createdDate = it.createdDate,
                    state = State(id = it.stateId, name = it.stateName),
                    fileInfo = FileInfo(
                        id = it.fileId,
                        fileName = it.fileName,
                        fileSize = it.fileSize,
                        filePath = it.filePath
                    )
                )
            }.awaitSingle()

        addenda.stateTransitions = stateTransitionService.findAllByRefId(addenda.id!!, StateType.ADDENDA).asFlux()
        addenda.observations = addendaCommentService.findAllCommentsByAddendaId(addendaId)

        return addenda
    }


    override suspend fun createAddendaComment(addendaId: Int, comment: AddendaComment): AddendaComment {
        comment.addendaId = addendaId
        return addendaCommentService.createComment(comment)
    }
}