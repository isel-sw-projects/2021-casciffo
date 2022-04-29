package isel.casciffo.casciffospringbackend.repository

import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeam
import isel.casciffo.casciffospringbackend.investigation_team.InvestigatorRole
import isel.casciffo.casciffospringbackend.proposals.ProposalModel
import isel.casciffo.casciffospringbackend.proposals.ProposalRepository
import isel.casciffo.casciffospringbackend.proposals.ResearchType
import isel.casciffo.casciffospringbackend.proposals.constants.PathologyRepository
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceTypeRepository
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticAreaRepository
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.research.Research
import isel.casciffo.casciffospringbackend.research.ResearchRepository
import isel.casciffo.casciffospringbackend.states.StateRepository
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import reactor.core.publisher.Flux
import java.time.LocalDate
import java.time.LocalDateTime

class ResearchRepositoryIT(
    @Autowired val researchRepository: ResearchRepository,
    @Autowired val proposalRepository: ProposalRepository,
    @Autowired val serviceTypeRepository: ServiceTypeRepository,
    @Autowired val stateRepository: StateRepository,
    @Autowired val pathologyRepository: PathologyRepository,
    @Autowired val therapeuticAreaRepository: TherapeuticAreaRepository,
) {

    //todo maybe tie up tests better to run smoother and only execute some statements once
    @BeforeAll
    fun setup() {
        //set up constants


        //set up proposal
        val proposal = ProposalModel(null, "sigla2", ResearchType.CLINICAL_TRIAL,
            LocalDateTime.now(), LocalDateTime.now(), 1, 1,1,1,
            1,
            investigationTeam = Flux.fromIterable(listOf(InvestigationTeam(null,0, InvestigatorRole.PRINCIPAL,1,null))),
            financialComponent = ProposalFinancialComponent(null, null, 1, 1, null, null)
        )
        val res = proposalRepository.save(proposal).block()

    }

    @Test
    fun testResearchRepositoryCreate() {
        val research = Research(null, 1, 1, "eudra_ct", 10, 20, "cro",
            LocalDate.now(), null, null, "industry", "protocol",
            "promotor", "1 | 4", ResearchType.OBSERVATIONAL_STUDY)
        runBlocking{
            val res = researchRepository.save(research).block()
            println(res)
            assert(res != null)
            assert(res!!.id != null)
        }
    }
}