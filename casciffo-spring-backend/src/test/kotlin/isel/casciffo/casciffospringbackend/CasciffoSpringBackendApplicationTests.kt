package isel.casciffo.casciffospringbackend

import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeam
import isel.casciffo.casciffospringbackend.investigation_team.InvestigationTeamRepository
import isel.casciffo.casciffospringbackend.investigation_team.InvestigatorRole
import isel.casciffo.casciffospringbackend.proposals.Proposal
import isel.casciffo.casciffospringbackend.proposals.ProposalRepository
import isel.casciffo.casciffospringbackend.proposals.ProposalService
import isel.casciffo.casciffospringbackend.proposals.ProposalType
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialComponent
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialService
import isel.casciffo.casciffospringbackend.proposals.finance.ProposalFinancialRepository
import isel.casciffo.casciffospringbackend.roles.UserRole
import isel.casciffo.casciffospringbackend.roles.UserRoleRepository
import isel.casciffo.casciffospringbackend.states.State
import isel.casciffo.casciffospringbackend.states.StateRepository
import isel.casciffo.casciffospringbackend.users.User
import isel.casciffo.casciffospringbackend.users.UserRepository
import isel.casciffo.casciffospringbackend.users.UserService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import reactor.core.publisher.Mono
import java.time.LocalDateTime

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
	@Autowired val stateRepository: StateRepository
) {

	@Test
	fun contextLoads() {
	}

	@Test
	fun cleanup() {
		userRepo.deleteAll().block()
		userRoleRepository.deleteAll().block()
	}

	@Test
	fun testUserRoleRepositoryCreate() {
		val userRole = UserRole(null, roleName = "superuser")
		val resRole: Mono<UserRole> = userRoleRepository.save(userRole)
		val resUserRole = resRole.block()
		println(resUserRole)

		val user = User(null, "hermelindo", "hermelindo@gmail.com", "123", roleId = resUserRole!!.roleId, role = null)
		val res: Mono<User> = userRepo.save(user)
		val resUser = res.block()
		println(resUser)
	}

	@Test
	fun testUserRepositoryFindAll() {
		val users = userRepo.findAll().collectList().block()
		println(users)
	}

	@Test
	fun testUserServiceFindAll() {
		val users = userService.getAllUsers()

		println(users.collectList().block())
	}

	@Test
	fun testUserServiceFindById() {
		val user = userService.getUser(1)

		println(user.block())
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
	fun testProposalServiceCreate() {

		val proposal = Proposal(null, "sigla2", ProposalType.CLINICAL_TRIAL,
			LocalDateTime.now(), LocalDateTime.now(), 1, 1,1,1,1,
			investigationTeam = listOf(InvestigationTeam(null,0,InvestigatorRole.PRINCIPAL,1,null)),
			financialComponent = ProposalFinancialComponent(null, 0, 1, 1, null,null),
			state = null, stateTransitions = null, serviceType = null, therapeuticArea = null, pathology = null, principalInvestigator = null,
			comments = null
			)
		proposalService.create(proposal)
	}

	@Test
	fun testProposalServiceFindAll() {
		val res = proposalService.getAllProposals().collectList().block()
		println(res)
	}

	@Test
	fun testFinancialComponentFindAll() {
		val res = proposalFinancialService.findComponentByProposalId(1).block()
		println(res)
	}

	@Test
	fun testCreateFinancialComponent() {

	}
}
