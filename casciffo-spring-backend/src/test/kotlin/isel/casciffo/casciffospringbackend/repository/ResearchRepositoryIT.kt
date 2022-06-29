package isel.casciffo.casciffospringbackend.repository

import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalRepository
import isel.casciffo.casciffospringbackend.proposals.constants.PathologyRepository
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceTypeRepository
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticAreaRepository
import isel.casciffo.casciffospringbackend.research.research.ResearchRepository
import isel.casciffo.casciffospringbackend.states.state.StateRepository
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class ResearchRepositoryIT(
    @Autowired val researchRepository: ResearchRepository,
    @Autowired val proposalRepository: ProposalRepository,
    @Autowired val serviceTypeRepository: ServiceTypeRepository,
    @Autowired val stateRepository: StateRepository,
    @Autowired val pathologyRepository: PathologyRepository,
    @Autowired val therapeuticAreaRepository: TherapeuticAreaRepository,
) {

    @Test
    fun testResearchRepositoryCreate() {
//        val research = Research(null, 1, 1, "eudra_ct", 10, 20, "cro",
//            Date.now(), null, null, "industry", "protocol",
//            "promotor", "1 | 4", ResearchType.OBSERVATIONAL_STUDY)
//        runBlocking{
//            val res = researchRepository.save(research).block()
//            println(res)
//            assert(res != null)
//            assert(res!!.id != null)
//        }
    }
}