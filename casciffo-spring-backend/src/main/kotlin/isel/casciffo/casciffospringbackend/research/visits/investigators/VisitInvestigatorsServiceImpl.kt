package isel.casciffo.casciffospringbackend.research.visits.investigators

import isel.casciffo.casciffospringbackend.users.user.UserService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class VisitInvestigatorsServiceImpl(
    @Autowired val visitInvestigatorsRepository: VisitInvestigatorsRepository,
    @Autowired val userService: UserService
) : VisitInvestigatorsService {
    override suspend fun findAllByVisitId(visitId: Int): Flow<VisitInvestigators> {
        return visitInvestigatorsRepository.findAllByVisitId(visitId).asFlow().map(this::loadInvestigators)
    }

    suspend fun loadInvestigators(visitInvestigators: VisitInvestigators) : VisitInvestigators {
        visitInvestigators.investigator = userService.getUser(visitInvestigators.investigatorId!!)
        return visitInvestigators
    }
}