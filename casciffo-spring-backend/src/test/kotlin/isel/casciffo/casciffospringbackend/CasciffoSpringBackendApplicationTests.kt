package isel.casciffo.casciffospringbackend

import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Encoders
import io.jsonwebtoken.security.Keys
import isel.casciffo.casciffospringbackend.aggregates.proposal.ProposalAggregateRepo
import isel.casciffo.casciffospringbackend.common.FILES_DIR
import isel.casciffo.casciffospringbackend.users.user_roles.UserRoles
import isel.casciffo.casciffospringbackend.users.user_roles.UserRolesRepo
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamModel
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamRepository
import isel.casciffo.casciffospringbackend.investigation_team.InvestigatorRole
import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalModel
import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalRepository
import isel.casciffo.casciffospringbackend.proposals.proposal.ProposalService
import isel.casciffo.casciffospringbackend.common.ResearchType
import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.files.FileInfoRepository
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsRepository
import isel.casciffo.casciffospringbackend.proposals.comments.ProposalCommentsService
import isel.casciffo.casciffospringbackend.proposals.constants.PathologyRepository
import isel.casciffo.casciffospringbackend.proposals.constants.ServiceTypeRepository
import isel.casciffo.casciffospringbackend.proposals.constants.TherapeuticAreaRepository
import isel.casciffo.casciffospringbackend.proposals.finance.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.finance.finance.ProposalFinancialRepository
import isel.casciffo.casciffospringbackend.proposals.finance.finance.ProposalFinancialService
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolService
import isel.casciffo.casciffospringbackend.proposals.timeline_events.ProposalEventType
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventModel
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventRepository
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventService
import isel.casciffo.casciffospringbackend.research.research.ResearchModel
import isel.casciffo.casciffospringbackend.research.research.ResearchRepository
import isel.casciffo.casciffospringbackend.research.research.ResearchService
import isel.casciffo.casciffospringbackend.research.patients.PatientModel
import isel.casciffo.casciffospringbackend.research.patients.ParticipantRepository
import isel.casciffo.casciffospringbackend.research.patients.ParticipantService
import isel.casciffo.casciffospringbackend.roles.Role
import isel.casciffo.casciffospringbackend.roles.RoleRepository
import isel.casciffo.casciffospringbackend.states.state.StateRepository
import isel.casciffo.casciffospringbackend.users.user.UserModel
import isel.casciffo.casciffospringbackend.users.user.UserRepository
import isel.casciffo.casciffospringbackend.users.user.UserService
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.runBlocking
import mu.KotlinLogging
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import reactor.core.publisher.Flux
import reactor.test.StepVerifier
import java.time.LocalDate
import kotlin.io.path.Path
import kotlin.io.path.fileSize
import kotlin.io.path.name
import kotlin.io.path.pathString

@ActiveProfiles(value = ["test"])
@SpringBootTest
class CasciffoSpringBackendApplicationTests(
    @Autowired val userRepo: UserRepository,
    @Autowired val roleRepository: RoleRepository,
    @Autowired val userService: UserService,
    @Autowired val proposalService: ProposalService,
    @Autowired val proposalRepository: ProposalRepository,
    @Autowired val proposalAggregateRepo: ProposalAggregateRepo,
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
    @Autowired val timelineEventRepository: TimelineEventRepository,
    @Autowired val aggregateRepo: ProposalAggregateRepo,
    @Autowired val userRolesRepo: UserRolesRepo,
    @Autowired val fileInfoRepository: FileInfoRepository,
    @Autowired val pathologyRepository: PathologyRepository,
    @Autowired val serviceTypeRepository: ServiceTypeRepository,
    @Autowired val therapeuticAreaRepository: TherapeuticAreaRepository
) {

    val logger = KotlinLogging.logger { }

    @Test
    fun saveFile() {
        val file = Path("C:\\Workspaces\\Tese\\2021-casciffo\\casciffo-spring-backend\\src\\main\\resources\\test.txt").toFile()
        val path = FILES_DIR("test.txt")
        val getFileInfo = { FileInfo(fileName = path.name, filePath = path.pathString, fileSize = path.fileSize()) }
        file.copyTo(path.toFile())

        runBlocking {
            fileInfoRepository.deleteByPFCId(3).awaitSingleOrNull()
            val fileInfo = fileInfoRepository.save(getFileInfo()).awaitSingleOrNull()

            logger.info {fileInfo}
        }

    }

//    @Test
//    fun testProposalPagination() {
//        val proposals = proposalAggregateRepo.findAllByTypeSorting(
//            type = ResearchType.CLINICAL_TRIAL,
//            order = "p.created_date DESC",
//            n = 1,
//            p = 0
//        )
//        StepVerifier.create(proposals)
//            .expectSubscription()
//            .thenConsumeWhile {
//                println(it)
//                true
//            }
//            .expectComplete()
//            .verifyThenAssertThat()
//    }

    @Test
    fun getProposalStats() {
        runBlocking {
            val stats = proposalService.getProposalStats().toList()
            assert(stats.isNotEmpty())
            assert(stats.size == ResearchType.values().size)
        }
    }

//    suspend fun Test123() {
//
//        val proposal = ProposalModel()
//
//        proposal.serviceType = serviceTypeRepository.findById(proposal.serviceTypeId!!).awaitSingle()
//        proposal.pathology = pathologyRepository.findById(proposal.pathologyId!!).awaitSingle()
//        proposal.therapeuticArea = therapeuticAreaRepository.findById(proposal.therapeuticAreaId!!).awaitSingle()
//        proposal.principalInvestigator = userRepo.findById(proposal.principalInvestigatorId!!).awaitSingle()
//        proposal.investigationTeam = investigationTeamRepository.findInvestigationTeamByProposalId(proposal.id!!).asFlow()
//        proposal.comments = proposalCommentsRepository.findByProposalId(proposal.id!!).asFlow()
//    }

//    fun test123() {
//        val proposal = ProposalModel()
//
//        Mono.just(proposal)
//            .flatMap {
//                serviceTypeRepository.findById(proposal.id!!)
//            }
//            .flatMap {
//
//            }
//    }

    @Test
    fun genKeys() {
        for (index in 1..10) {
            val key = Keys.secretKeyFor(SignatureAlgorithm.HS512)
            println(Encoders.BASE64.encode(key.encoded))
        }
    }

    @Test
    fun testAggregateRepository() {

        StepVerifier
            .create(aggregateRepo.findAllByType(ResearchType.CLINICAL_TRIAL))
            .expectSubscription()
            .`as`("Test findAllByType expect no error in query")
            .consumeNextWith {
                assert(it.createdDate != null)
                assert(it.pathologyName != null)
                assert(it.therapeuticAreaName != null)
                assert(it.serviceName != null)
                assert(it.stateName != null)
                assert(it.piName != null)
                assert(it.promoterName != null)
                assert(it.proposalType != null)
            }.thenConsumeWhile { true }
            .expectComplete()
            .log()
            .verifyThenAssertThat()

        StepVerifier
            .create(aggregateRepo.findByProposalId(1))
            .expectSubscription()
            .`as`("Test findById expect proposal details properly mapped")
            .consumeNextWith {
                assert(it.pfcId != null)
                assert(it.stateName != null)
                assert(it.stateId != null)
                assert(it.promoterName != null)
                assert(it.promoterEmail != null)
                assert(it.piId != null)
                assert(it.piEmail != null)
            }
            .expectComplete()
            .log()
            .verifyThenAssertThat()
    }

    @Test
    fun whenRolesAndUsersCreated_thenSearchUsersByRoleNames() {
        val userRole = Role(roleName = "MockRole1")
        val userRole2 = Role(roleName = "MockRole2")
        val resRole: Flux<Role> = roleRepository.saveAll(listOf(userRole, userRole2))

        StepVerifier
            .create(resRole)
            .expectSubscription()
            .`as`("Verify roles were created properly")
            .expectNextCount(2)
            .thenConsumeWhile {
                if (it === null) return@thenConsumeWhile false
                assert(listOf(userRole, userRole2).any { role -> role.roleName === it.roleName })
                true
            }
            .expectComplete()
            .log()
            .verifyThenAssertThat()

        val roles = resRole.collectList().block()
        assert(roles != null)

        val userModel = UserModel(
            name = "hermelindo",
            email = "hermelindo2@gmail.com",
            password = "123"
        )
        val userModel2 = UserModel(
            name = "eric brown",
            email = "eric.brown@gmail.com",
            password = "password"
        )

        val usersFlux: Flux<UserModel> = userRepo.saveAll(listOf(userModel, userModel2))

        StepVerifier
            .create(usersFlux)
            .expectSubscription()
            .`as`("Verify users were created properly")
            .expectNextCount(2)
            .thenConsumeWhile {
                if (it === null) return@thenConsumeWhile false
                assert(listOf("hermelindo", "eric brown").contains(it.name))
                true
            }
            .expectComplete()
            .log()
            .verifyThenAssertThat()

        val users = usersFlux.collectList().block()
        val userRoles = userRolesRepo.saveAll(
            listOf(
                UserRoles(userId = users!![0].userId, roleId = roles!![0].roleId),
                UserRoles(userId = users[1].userId, roleId = roles[1].roleId)
            )
        )

        StepVerifier
            .create(userRoles)
            .expectSubscription()
            .`as`("Expect role association to users to be correct")
            .thenConsumeWhile {
                assert(it.roleId != null)
                assert(it.userId != null)
                true
            }
            .expectComplete()
            .log()
            .verifyThenAssertThat()

        StepVerifier
            .create(userRepo.findAllByRoleNameIsIn(listOf(roles[0].roleName!!)))
            .expectSubscription()
            .`as`("Search for created users by their role")
            .expectNextCount(1)
            .thenConsumeWhile {
                assert(users[0].userId === it.userId)
                true
            }
            .expectComplete()
            .log()
            .verifyThenAssertThat()
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
            }
            .expectComplete()
            .log()
            .verifyThenAssertThat()

        StepVerifier.create(proposalRepository.findById(proposal.id!!))
            .expectSubscription()
            .`as`("Find created proposal with id ${proposal.id}")
            .thenAwait()
            .assertNext {
                it.id !== null
            }
            .expectComplete()
            .log()
            .verifyThenAssertThat()
    }

    @Test
    fun testResearchRepositoryCreate() {
        val researchModel = ResearchModel(
            null, 1, 1, "eudra_ct", 10, 20, "cro",
            LocalDate.now(), null, null, industry = "industry", protocol =  "protocol",
            initiativeBy = "promotor", phase = "1 | 4", type = ResearchType.CLINICAL_TRIAL
        )
        runBlocking {
            val res = researchRepository.save(researchModel).awaitSingle()
            assert(res != null)
            assert(res!!.id != null)
        }
    }

    @Test
    fun testServiceAddParticipantToResearch() {
        var patient = PatientModel(
            processId = 102,
            fullName = "manel dos testes",
            gender = "m",
            age = 50
        )
        runBlocking {
            patient = participantService.save(patient)
            val addedParticipant = participantService.addParticipantToResearch(patient.id!!, 1)
            val participants = participantService.findAllByResearchId(1)
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
                    null
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
                }
                .expectComplete()
                .log()
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
                }
                .expectComplete()
                .log()
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
                .log()
                .verifyThenAssertThat()
        }
    }

    @Test
    fun updateOverDueDeadLines() {
        runBlocking {
            val savedEvent =
                timelineEventRepository.save(
                    TimelineEventModel(
                        proposalId = 1,
                        eventType = ProposalEventType.DEADLINE,
                        eventName = "toUpdateSoon",
                        deadlineDate = LocalDate.of(2022, 1, 1)
                    )
                ).awaitSingleOrNull()
            assert(savedEvent != null)
            val events = timelineEventRepository
                .findAllByDeadlineDateBeforeAndCompletedDateIsNull().collectList().awaitSingleOrNull()
            assert(!events.isNullOrEmpty())
            val updatedEvents = timelineEventService
                .updateOverDueDeadlines()
                .collectList().awaitSingleOrNull()
            assert(!updatedEvents.isNullOrEmpty())
            updatedEvents!!.forEach {
                assert(it.isOverDue!!)
                assert(it.daysOverDue!! > 0)
            }
        }
    }
}
