package isel.casciffo.casciffospringbackend.files

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ProposalFilesRepository : ReactiveCrudRepository<ProposalFiles, Int> {
}