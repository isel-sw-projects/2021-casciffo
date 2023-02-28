package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.aggregates.addenda.AddendaAggregateRepo
import isel.casciffo.casciffospringbackend.common.*
import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.files.FileInfoRepository
import isel.casciffo.casciffospringbackend.files.FileService
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaCommentService
import isel.casciffo.casciffospringbackend.security.BearerToken
import isel.casciffo.casciffospringbackend.security.JwtSupport
import isel.casciffo.casciffospringbackend.states.state.State
import isel.casciffo.casciffospringbackend.states.state.StateRepository
import isel.casciffo.casciffospringbackend.states.state.StateService
import isel.casciffo.casciffospringbackend.states.state.States
import isel.casciffo.casciffospringbackend.states.transitions.StateTransitionService
import isel.casciffo.casciffospringbackend.users.notifications.NotificationModel
import isel.casciffo.casciffospringbackend.users.user.UserService
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.codec.multipart.FilePart
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import reactor.kotlin.core.publisher.toFlux
import java.nio.file.Path
import java.time.LocalDateTime
import kotlin.io.path.Path

@Service
class AddendaServiceImpl(
    @Autowired val addendaRepository: AddendaRepository,
    @Autowired val addendaAggregateRepo: AddendaAggregateRepo,
    @Autowired val stateTransitionService: StateTransitionService,
    @Autowired val stateService: StateService,
    @Autowired val addendaCommentService: AddendaCommentService,
    @Autowired val fileService: FileService,
    @Autowired val userService: UserService
): AddendaService {

    override suspend fun createAddenda(researchId: Int, addendaFile: FilePart?): Addenda {
        if(addendaFile == null) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O ficheiro é obrigatório!!")
        val fileInfo = fileService.createFile(addendaFile)
        val initialState = stateService.findInitialStateByType(StateType.ADDENDA)
        val addenda = addendaRepository.save(Addenda(
            researchId = researchId,
            stateId = initialState.id,
            createdDate = LocalDateTime.now(),
            fileId = fileInfo.id!!
        )).awaitSingle()

        addenda.fileInfo = fileInfo
        addenda.state = initialState
        return addenda
    }

    override suspend fun updateAddenda(addenda: Addenda): Addenda {
        val existingAddenda = addendaRepository.findById(addenda.id!!).awaitFirstOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Adenda não existe!")
        val hasStateTransitioned = addenda.stateId == existingAddenda.stateId

        if(hasStateTransitioned) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Transições de estado não são permitidas aqui.")
        }

        return addendaRepository.save(addenda).awaitSingleOrNull() ?: throw ResponseStatusException(HttpStatus.I_AM_A_TEAPOT, "Idk what happened bro ngl")
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

    override suspend fun transitionState(addendaId: Int, nextStateId: Int, request: ServerHttpRequest): Addenda {
        val userRoles = userService.getUserRolesFromRequest(request)
        val addenda = getAddendaDetails(addendaId, false)
        return handleStateTransition(addenda, nextStateId, userRoles)
    }

    override suspend fun cancelAddenda(addendaId: Int, researchId: Int, request: ServerHttpRequest): Addenda {
        val userRoles = userService.getUserRolesFromRequest(request)
        val addenda = getAddendaDetails(addendaId, false)

        val isTerminal = stateService.isTerminalState(addenda.stateId!!, StateType.ADDENDA)

        if(isTerminal) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Não pode alterar uma addenda indeferida.")

        val canceledState = stateService.findByName(States.INDEFERIDO.name)

        stateTransitionService.newTransition(
            referenceId = addenda.id!!,
            oldStateId = addenda.stateId!!,
            newStateId = canceledState.id!!,
            stateType = StateType.ADDENDA
        )

        addenda.stateId = canceledState.id
        addenda.state = canceledState
        addenda.stateTransitions = stateTransitionService.findAllByRefId(addendaId, StateType.ADDENDA)

        addendaRepository.save(addenda).awaitSingle()
        return addenda
    }

    suspend fun handleStateTransition(addenda: Addenda, nextStateId: Int, userRoles: List<String>): Addenda {

        val currState = stateService.findById(addenda.stateId!!)

        val nextState = stateService.findById(nextStateId)

        nextState.roles = stateService.verifyNextStateValid(currState.id!!, nextStateId, StateType.ADDENDA, userRoles).toFlux()


        stateTransitionService.newTransition(addenda.stateId!!, nextState.id!!, StateType.ADDENDA, addenda.id!!)

//        if(nextState.stateFlowType !== StateFlowType.TERMINAL) {
//            notifyTeam(addenda.id!!,
//                NotificationModel(
//                    title = "Progresso no estado de Proposta",
//                    description = "Proposta com sigla ${proposal.sigla!!} avançou para o estado ${nextState.name!!}",
//                    notificationType = NotificationType.PROPOSAL_DETAILS,
//                    ids = convertToJson(listOf(Pair("proposalId", proposal.id!!))),
//                    viewed = false
//                )
//            )
//        }

        addenda.stateId = nextState.id
        addenda.state = nextState
        addendaRepository.save(addenda).awaitSingle()
        addenda.stateTransitions = stateTransitionService.findAllByRefId(addenda.id!!, StateType.ADDENDA)
        return addenda
    }

    override suspend fun getAddendaDetails(addendaId: Int, loadLists:Boolean): Addenda {
        val addenda = addendaAggregateRepo.findByAddendaId(addendaId)
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

        if(loadLists) {
            addenda.stateTransitions = stateTransitionService.findAllByRefId(addenda.id!!, StateType.ADDENDA)
            addenda.observations = addendaCommentService.findAllCommentsByAddendaId(addendaId)
        }

        return addenda
    }

    override suspend fun getAddendaFile(addendaId: Int, researchId: Int): Path {
        val fileInfo = fileService.getFileByAddendaId(addendaId)
        return Path(fileInfo.filePath!!)
    }


    override suspend fun createAddendaComment(addendaId: Int, comment: AddendaComment): AddendaComment {
        comment.addendaId = addendaId
        return addendaCommentService.createComment(comment)
    }
}