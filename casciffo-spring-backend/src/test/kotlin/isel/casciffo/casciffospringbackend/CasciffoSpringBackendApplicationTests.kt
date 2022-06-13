package isel.casciffo.casciffospringbackend

import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Encoders
import io.jsonwebtoken.security.Keys
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamModel
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamRepository
import isel.casciffo.casciffospringbackend.investigation_team.InvestigatorRole
import isel.casciffo.casciffospringbackend.proposals.ProposalModel
import isel.casciffo.casciffospringbackend.proposals.ProposalRepository
import isel.casciffo.casciffospringbackend.proposals.ProposalService
import isel.casciffo.casciffospringbackend.proposals.ResearchType
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsRepository
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsService
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialRepository
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialService
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolService
import isel.casciffo.casciffospringbackend.proposals.timeline_events.ProposalEventType
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventModel
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventRepository
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventService
import isel.casciffo.casciffospringbackend.research.ResearchModel
import isel.casciffo.casciffospringbackend.research.ResearchRepository
import isel.casciffo.casciffospringbackend.research.ResearchService
import isel.casciffo.casciffospringbackend.research.patients.Participant
import isel.casciffo.casciffospringbackend.research.patients.ParticipantRepository
import isel.casciffo.casciffospringbackend.research.patients.ParticipantService
import isel.casciffo.casciffospringbackend.roles.Role
import isel.casciffo.casciffospringbackend.roles.UserRole
import isel.casciffo.casciffospringbackend.roles.UserRoleRepository
import isel.casciffo.casciffospringbackend.states.StateRepository
import isel.casciffo.casciffospringbackend.users.UserModel
import isel.casciffo.casciffospringbackend.users.UserRepository
import isel.casciffo.casciffospringbackend.users.UserService
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.test.StepVerifier
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.logging.Logger

@ActiveProfiles(value = ["test"])
@SpringBootTest
class CasciffoSpringBackendApplicationTests(
    @Autowired val userRepo: UserRepository,
    @Autowired val userRoleRepository: UserRoleRepository,
    @Autowired val userService: UserService,
    @Autowired val proposalService: ProposalService,
    @Autowired val proposalRepository: ProposalRepository,
    @Autowired val investigationTeamRepository: InvestigationTeamRepository,
    @Autowired val proposalFinancialRepository: ProposalFinancialRepository,
    @Autowired val proposalFinancialService: ProposalFinancialService,
    @Autowired val stateRepository: StateRepository,
    @Autowired val researchRepository: ResearchRepository,
    @Autowired val researchService: ResearchService,
    @Autowired val participantService: ParticipantService,
    @Autowired val participantRepository: ParticipantRepository,
    @Autowired val protocolService: ProtocolService,
    @Autowired val proposalCommentsRepository: ProposalCommentsRepository,
    @Autowired val proposalCommentsService: ProposalCommentsService,
    @Autowired val timelineEventService: TimelineEventService,
    @Autowired val timelineEventRepository: TimelineEventRepository
) {

    val logger = LoggerFactory.getLogger(this.javaClass.simpleName)

    @Test
    fun genKeys() {
        for (index in 1..10) {
            val key = Keys.secretKeyFor(SignatureAlgorithm.HS512)
            println(Encoders.BASE64.encode(key.encoded))
        }
    }

    @Test
    fun whenRolesAndUsersCreated_thenSearchUsersByRoleNames() {
        val userRole = UserRole(roleName = "MockRole1")
        val userRole2 = UserRole(roleName = "MockRole2")
        val resRole: Flux<UserRole> = userRoleRepository.saveAll(listOf(userRole, userRole2))

        StepVerifier
            .create(resRole)
            .expectSubscription()
            .`as`("Verify roles were created properly")
            .expectNextCount(2)
            .thenConsumeWhile {
                if (it === null) return@thenConsumeWhile false
                assert(listOf(userRole, userRole2).any { role -> role.roleName === it.roleName })
                logger.debug("$it")
                true
            }
            .expectComplete()
            .verifyThenAssertThat()

        val roles = resRole.collectList().block()
        assert(roles != null)
        val userModel = UserModel(
            name = "hermelindo",
            email = "hermelindo2@gmail.com",
            password = "123",
            roleId = roles!![0].roleId
        )
        val userModel2 = UserModel(
            name = "eric brown",
            email = "eric.brown@gmail.com",
            password = "password",
            roleId = roles[1].roleId
        )
        val usersFlux: Flux<UserModel> = userRepo.saveAll(listOf(userModel, userModel2))

        StepVerifier
            .create(usersFlux)
            .expectSubscription()
            .`as`("Verify users were created properly")
            .expectNextCount(2)
            .thenConsumeWhile {
                if (it === null) return@thenConsumeWhile false
                assert(roles.any { role -> it.roleId === role.roleId })
                assert(listOf("hermelindo", "eric brown").contains(it.name))
                logger.debug("$it")
                true
            }
            .expectComplete()
            .verifyThenAssertThat()


        StepVerifier
            .create(userRepo.findAllByRoleNameIsIn(roles.map { it.roleName!! }))
            .expectSubscription()
            .`as`("Verify users created properly by searching by their role")
            .expectNextCount(2)
            .thenConsumeWhile {
                if (it === null) return@thenConsumeWhile false
                assert(it.roleId !== null)
                assert(roles.any { role -> it.roleId === role.roleId })
                logger.debug("$it")
                true
            }
            .expectComplete()
            .verifyThenAssertThat()

//		Clean up no longer needed
//		runBlocking {
//			val test = userService.getAllUsersByRoleNames(roles.map { it.roleName }).toList()
//			assert(test.isNotEmpty())
//			assert(test.count() == 2)
//			userRepo.deleteAllById(test.map { it!!.roleId }).awaitSingleOrNull()
//			userRoleRepository.deleteAllById(roles.map { it.roleId }).awaitSingleOrNull()
//		}
    }

    @Test
    fun whenProposalCreated_thenFindIdInRepository() {
        val proposal = ProposalModel(
            sigla = "Created for test",
            type = ResearchType.OBSERVATIONAL_STUDY,
            stateId = 1,
            principalInvestigatorId = 1,
            therapeuticAreaId = 1,
            serviceTypeId = 1,
            pathologyId = 1
        )

        StepVerifier
            .create(proposalRepository.save(proposal))
            .expectSubscription()
            .`as`("Create proposal")
            .consumeNextWith {
                assert(it.id !== null)
                proposal.id = it.id
                logger.debug("$it was created properly")
            }
            .expectComplete()
            .verifyThenAssertThat()

        StepVerifier.create(proposalRepository.findById(proposal.id!!))
            .expectSubscription()
            .`as`("Find created proposal with id ${proposal.id}")
            .thenAwait()
            .assertNext {
                it.id !== null
            }
            .expectComplete()
            .verifyThenAssertThat()
    }

    @Test
    fun testUserAndUserRoleRepositoryCreate() {
        val userRole = UserRole(null, roleName = "superuser")
        val resRole: Mono<UserRole> = userRoleRepository.save(userRole)
        val resUserRole = resRole.block()
        println(resUserRole)

        val userModel = UserModel(
            null, "hermelindo", "hermelindo@gmail.com", "123",
            roleId = resUserRole!!.roleId, role = null
        )
        val res: Mono<UserModel> = userRepo.save(userModel)
        val resUser = res.block()
        println(resUser)
    }

    @Test
    fun testUserRepositoryFindAll() {
        val users = userRepo.findAll().collectList().block()
        println(users)
    }

    @Test
    fun testInvestigationTeamRepositoryFindAll() {
        val teams = investigationTeamRepository.findAll().collectList().block()
        print(teams)
    }

    @Test
    fun testInvestigationTeamRepositoryFindAllByProposal() {
        val teams = investigationTeamRepository.findInvestigationTeamByProposalId(1).collectList().block()
        print(teams)
    }

    @Test
    fun testProposalRepositoryFindAll() {
        val res = proposalRepository.findAll().collectList().block()
        println(res)
    }

    @Test
    fun testResearchRepositoryCreate() {
        val researchModel = ResearchModel(
            null, 1, 1, "eudra_ct", 10, 20, "cro",
            LocalDate.now(), null, null, "industry", "protocol",
            "promotor", "1 | 4", ResearchType.CLINICAL_TRIAL
        )
        runBlocking {
            val res = researchRepository.save(researchModel).block()
            println(res)
            assert(res != null)
            assert(res!!.id != null)
        }
    }

    @Test
    fun testServiceAddParticipantToResearch() {
        var participant = Participant(
            processId =  102,
            fullName = "manel dos testes",
            gender = "m",
            age = 50)
        runBlocking {
            participant = participantService.save(participant)
            val addedParticipant = participantService.addParticipantToResearch(participant.id!!, 1)
            val participants = participantService.getParticipantsByResearchId(1)
            assertDoesNotThrow {
                participants.first { it.id === addedParticipant.id }
            }
        }
    }

    @Test
    fun testProposalRepositoryCreate() {
        val proposal = ProposalModel(
            sigla = "sigla2",
            type = ResearchType.OBSERVATIONAL_STUDY,
            stateId = 1,
            pathologyId = 1,
            serviceTypeId = 1,
            therapeuticAreaId = 1,
            principalInvestigatorId = 1
        )
        runBlocking {
            proposalRepository
                .save(proposal)
                .awaitSingleOrNull()
                ?.let {
                    assert(it.id != null)
                    logger.debug("$it created as expected.")
                }
        }
    }


    @Test
    fun testProposalServiceCreate() {

        val proposal = ProposalModel(
            sigla = "sigla2",
            type = ResearchType.CLINICAL_TRIAL,
            pathologyId = 1,
            serviceTypeId = 1,
            stateId = 1,
            therapeuticAreaId = 1,
            principalInvestigatorId = 1,
            investigationTeam = Flux.fromIterable(
                listOf(
                    InvestigationTeamModel(
                        memberRole = InvestigatorRole.PRINCIPAL,
                        memberId = 1
                    )
                )
            ),
            financialComponent = ProposalFinancialComponent(promoterId = 1, financialContractId = 1)
        )

        runBlocking {
            val res = proposalService.create(proposal)
            assert(res.investigationTeam != null)

            StepVerifier
                .create(res.investigationTeam!!)
                .expectSubscription()
                .`as`("Test ProposalService#Create clinical trial proposal")
                .consumeNextWith {
                    assert(it.id !== null)
                    assert(it.memberId == 1)
                    assert(res.financialComponent!!.id != null)
                    assert(res.financialComponent!!.protocol != null)
                    logger.debug("Investigation team, FinancialComponent and Protocol was created alongside proposal as expected.")
                }
                .expectComplete()
                .verifyThenAssertThat()
        }
    }

    @Test
    fun testProposalServiceUpdate() {
        runBlocking {
            val proposalToBeSaved = ProposalModel(
                null, "antes de update", ResearchType.CLINICAL_TRIAL, stateId = 1,
                pathologyId = 1, serviceTypeId = 1, principalInvestigatorId = 1, therapeuticAreaId = 1
            )
            val proposal = proposalRepository.save(proposalToBeSaved).awaitSingle()
            assert(proposal.sigla == proposalToBeSaved.sigla)
            proposal.sigla = "sigla depois"
            val updated = proposalService.updateProposal(proposal)
            assert(updated.sigla == proposal.sigla)
        }
    }

    @Test
    fun testProposalServiceFindAll() {
        runBlocking {
            val res = proposalService.getAllProposals(ResearchType.CLINICAL_TRIAL).asFlux()
            StepVerifier
                .create(res)
                .expectSubscription()
                .consumeNextWith {
                    assert(it.id != null)
                    assert(it.financialComponent!!.id != null)
                    assert(it.financialComponent!!.promoter!!.id != null)
                    assert(it.financialComponent!!.partnerships != null)
                    logger.debug(
                        "ProposalService#findAll loaded complex " +
                                "relationships:[financialComponent, Promoter, Partnerships] properly"
                    )
                }
                .expectComplete()
                .verifyThenAssertThat()
        }
    }

    @Test
    fun testFinancialComponentRepositoryFindAll() {
        runBlocking {
            val res = proposalFinancialRepository.findByProposalId(1).awaitSingle()
            assert(res.id != null)
            assert(res.promoterId != null)
            assert(res.partnerships == null)
            assert(res.promoter == null)
        }
    }

    @Test
    fun testFinancialComponentServiceFindAll() {
        runBlocking {
            val res = proposalFinancialService.findComponentByProposalId(1, true)
            assert(res.id != null)
            assert(res.promoter != null)
            StepVerifier.create(res.partnerships!!)
                .expectSubscription()
                .assertNext {
                    it.id != null && it.financeComponentId == res.id
                }
                .expectComplete()
                .verifyThenAssertThat()
        }
    }

    @Test
    fun updateOverDueDeadLines() {
        runBlocking {
            timelineEventRepository.save(
                TimelineEventModel(
                    proposalId = 1,
                    eventType = ProposalEventType.DEADLINE,
                    eventName = "toUpdateSoon",
                    deadlineDate = LocalDate.of(2022, 1, 1)
                )
            ).awaitSingleOrNull()
            val events = timelineEventRepository
                .findAllByDeadlineDateBeforeAndCompletedDateIsNull().collectList().awaitSingleOrNull()
            assert(!events.isNullOrEmpty())
            val updatedEvents = timelineEventService
                .updateOverDueDeadline()
                .collectList().awaitSingleOrNull()
            assert(!updatedEvents.isNullOrEmpty())
            updatedEvents!!.forEach {
                assert(it.isOverDue!!)
                assert(it.daysOverDue!! > 0)
            }
        }
    }
}
