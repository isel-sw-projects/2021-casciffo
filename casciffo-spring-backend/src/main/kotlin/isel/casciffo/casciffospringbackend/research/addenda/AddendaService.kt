package isel.casciffo.casciffospringbackend.research.addenda


interface AddendaService {
    suspend fun createAddenda(addenda: Addenda) : Addenda
    suspend fun updateAddenda(addenda: Addenda) : Addenda
    suspend fun getAddendaByResearchId(researchId: Int) : Addenda
}