package isel.casciffo.casciffospringbackend.proposals
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/proposals")
class ProposalController(@Autowired val service: ProposalService) {


    @GetMapping
    suspend fun getAllProposals(@RequestParam(required = true) type: ResearchType) : Flow<Proposal> {
        return service.getAllProposals(type)
    }
}