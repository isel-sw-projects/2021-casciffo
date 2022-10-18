package isel.casciffo.casciffospringbackend.research.addenda

import isel.casciffo.casciffospringbackend.research.addenda.comments.AddendaComment
import reactor.core.publisher.Flux


interface AddendaService {
    suspend fun createAddenda(addenda: Addenda) : Addenda
    suspend fun updateAddenda(addenda: Addenda) : Addenda
    suspend fun getAddendaByResearchId(researchId: Int) : Flux<Addenda>

    suspend fun getAddendaDetails(addendaId: Int): Addenda

    suspend fun createAddendaComment(addendaId: Int, comment: AddendaComment): AddendaComment
}