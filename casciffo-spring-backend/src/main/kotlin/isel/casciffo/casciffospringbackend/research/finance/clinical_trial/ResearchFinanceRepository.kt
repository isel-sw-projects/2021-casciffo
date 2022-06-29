package isel.casciffo.casciffospringbackend.research.finance.clinical_trial

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ResearchFinanceRepository:
    ReactiveCrudRepository<ResearchFinance, Int>