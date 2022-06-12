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
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventRepository
import isel.casciffo.casciffospringbackend.proposals.timeline_events.TimelineEventService
import isel.casciffo.casciffospringbackend.research.ResearchModel
import isel.casciffo.casciffospringbackend.research.ResearchRepository
import isel.casciffo.casciffospringbackend.research.ResearchService
import isel.casciffo.casciffospringbackend.research.patients.Participant
import isel.casciffo.casciffospringbackend.research.patients.ParticipantRepository
import isel.casciffo.casciffospringbackend.research.patients.ParticipantService
import isel.casciffo.casciffospringbackend.roles.UserRole
import isel.casciffo.casciffospringbackend.roles.UserRoleRepository
import isel.casciffo.casciffospringbackend.states.StateRepository
import isel.casciffo.casciffospringbackend.users.UserModel
import isel.casciffo.casciffospringbackend.users.UserRepository
import isel.casciffo.casciffospringbackend.users.UserService
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactor.asFlux
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.test.StepVerifier
import java.time.LocalDate
import java.time.LocalDateTime

//@ActiveProfiles(value = ["test"])
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


	@Test
	fun updateOverDueDeadLines() {
		runBlocking {
			val events = timelineEventRepository
				.findAllByDeadlineDateBeforeAndCompletedDateIsNull().collectList().awaitSingleOrNull()
			assert(!events.isNullOrEmpty())
			val updatedEvents = timelineEventService
				.updateOverDueDeadline()
				.collectList().awaitSingleOrNull()
			assert(!updatedEvents.isNullOrEmpty())
			updatedEvents!!.forEach{
				assert(it.isOverDue!!)
				assert(it.daysOverDue!! > 0)
			}
		}
	}
	@Test
	fun genKeys() {
		for(index in 1..10) {
			val key = Keys.secretKeyFor(SignatureAlgorithm.HS512)
			println(Encoders.BASE64.encode(key.encoded))
		}
	}

	@Test
	fun whenProposalCreated_thenFindIdInRepository() {
		StepVerifier.create(proposalRepository.findById(1))
			.expectSubscription()
			.`as`("Find proposal by id")
			.thenAwait()
			.assertNext{
				it.id !== null
			}
			.expectComplete()
			.verifyThenAssertThat()
	}

	@Test
	fun whenRolesAndUsersCreated_thenSearchUsersByRoleNames() {
		val userRole = UserRole(null, roleName = "finance")
		val userRole2 = UserRole(null, roleName = "management")
		val resRole: Flux<UserRole> = userRoleRepository.saveAll(listOf(userRole, userRole2))

		StepVerifier
			.create(resRole)
			.expectSubscription()
			.thenAwait()
			.expectNextCount(2)
			.expectComplete()
			.verifyThenAssertThat()

		val roles = resRole.collectList().block()
		assert(roles != null)
		val userModel = UserModel(null, "hermelindo", "hermelindo2@gmail.com", "123",
			roleId = roles!![0].roleId, role = null)
		val userModel2 = UserModel(null, "eric brown", "eric.brown@gmail.com", "password",
			roleId = roles[1].roleId, role = null)
		val usersFlux: Flux<UserModel> = userRepo.saveAll(listOf(userModel, userModel2))

		StepVerifier
			.create(usersFlux)
			.expectSubscription()
			.thenAwait()
			.expectNextCount(2)
			.expectComplete()
			.verifyThenAssertThat()

		runBlocking {
			val test = userService.getAllUsersByRoleNames(roles.map { it.roleName }).toList()
			assert(test.isNotEmpty())
			assert(test.count() == 2)
			userRepo.deleteAllById(test.map { it!!.roleId })
			userRoleRepository.deleteAllById(roles.map { it.roleId })
		}
	}

	@Test
	fun testUserAndUserRoleRepositoryCreate() {
		val userRole = UserRole(null, roleName = "superuser")
		val resRole: Mono<UserRole> = userRoleRepository.save(userRole)
		val resUserRole = resRole.block()
		println(resUserRole)

		val userModel = UserModel(null, "hermelindo", "hermelindo@gmail.com", "123",
			roleId = resUserRole!!.roleId, role = null)
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
		val researchModel = ResearchModel(null, 1, 1, "eudra_ct", 10, 20, "cro",
			LocalDate.now(), null, null, "industry", "protocol",
			"promotor", "1 | 4", ResearchType.CLINICAL_TRIAL)
		runBlocking{
			val res = researchRepository.save(researchModel).block()
			println(res)
			assert(res != null)
			assert(res!!.id != null)
		}
	}

	@Test
	fun testServiceAddParticipantToResearch() {
		var participant = Participant(null, 102, "manel dos testes", "m", 50)
		runBlocking {
			participant = participantService.findByProcessId(102) ?: participantService.save(participant)
			val addedParticipant = participantService.addParticipantToResearch(participant.id!!, 1)
			val participants = participantService.getParticipantsByResearchId(1)
			assert(participants.first().id === addedParticipant.id)
		}
	}



	@Test
	fun testProposalRepositoryCreate() {
		val proposal = ProposalModel(null, "sigla2", ResearchType.OBSERVATIONAL_STUDY,
			LocalDateTime.now(), LocalDateTime.now(),
			1, 1,1,1, 1
		)
		runBlocking {
			val res = proposalRepository.save(proposal).block()
			println(res)
			assert(res != null)
			assert(res!!.id != null)
		}
	}

	@Test
	fun testProposalServiceCreate() {

		val proposal = ProposalModel(null, "sigla2", ResearchType.OBSERVATIONAL_STUDY,
			LocalDateTime.now(), LocalDateTime.now(), 1, 1,1,1,1,
			investigationTeam = Flux.fromIterable(listOf(InvestigationTeamModel(proposalId = 0,memberRole = InvestigatorRole.PRINCIPAL, memberId = 1))),
			financialComponent = ProposalFinancialComponent(promoterId = 1, financialContractId = 1))
		runBlocking {
			val res = proposalService.create(proposal)
			assert(res.investigationTeam != null)
			val investigationTeam = res.investigationTeam!!

			StepVerifier
				.create(investigationTeam)
				.expectSubscription()
				.thenAwait()
				.expectNextCount(1)
				.expectNextMatches{it.id != null}
				.expectComplete()
				.verifyThenAssertThat()

			assert(res.financialComponent!!.id != null)
		}
	}

	@Test
	fun testProposalServiceUpdate() {
		runBlocking {
			val proposalToBeSaved = ProposalModel(null, "antes de update", ResearchType.CLINICAL_TRIAL, stateId = 1,
			pathologyId = 1, serviceTypeId = 1, principalInvestigatorId = 1, therapeuticAreaId = 1)
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
				.thenAwait()
				.expectNextCount(1)
				.assertNext{
					it.id != null
					it.financialComponent!!.id != null
					it.financialComponent!!.promoter!!.id != null
				}
				.thenConsumeWhile{true}
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
				.thenAwait()
				.assertNext{
					it.id != null && it.financeComponentId == res.id
				}
				.expectComplete()
				.verifyThenAssertThat()
		}
	}
}
