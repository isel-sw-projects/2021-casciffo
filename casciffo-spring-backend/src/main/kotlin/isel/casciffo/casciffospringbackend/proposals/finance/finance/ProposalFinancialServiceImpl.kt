package isel.casciffo.casciffospringbackend.proposals.finance.finance

import isel.casciffo.casciffospringbackend.common.FILES_DIR
import isel.casciffo.casciffospringbackend.common.ValidationType
import isel.casciffo.casciffospringbackend.files.FileInfo
import isel.casciffo.casciffospringbackend.files.FileInfoRepository
import isel.casciffo.casciffospringbackend.proposals.finance.partnership.Partnership
import isel.casciffo.casciffospringbackend.proposals.finance.partnership.PartnershipService
import isel.casciffo.casciffospringbackend.proposals.finance.promoter.PromoterRepository
import isel.casciffo.casciffospringbackend.proposals.finance.protocol.ProtocolService
import isel.casciffo.casciffospringbackend.validations.Validation
import isel.casciffo.casciffospringbackend.validations.ValidationComment
import isel.casciffo.casciffospringbackend.validations.ValidationsRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import mu.KLogger
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import java.nio.file.Path
import java.time.LocalDateTime
import kotlin.io.path.Path
import kotlin.io.path.fileSize
import kotlin.io.path.name
import kotlin.io.path.pathString

@Service
class ProposalFinancialServiceImpl(
    @Autowired val proposalFinancialRepository: ProposalFinancialRepository,
    @Autowired val promoterRepository: PromoterRepository,
    @Autowired val partnershipService: PartnershipService,
    @Autowired val protocolService: ProtocolService,
    @Autowired val validationsRepository: ValidationsRepository,
    @Autowired val fileInfoRepository: FileInfoRepository,
) : ProposalFinancialService {

    val logger: KLogger = KotlinLogging.logger { }

    @Transactional(rollbackFor = [ResponseStatusException::class])
    override suspend fun createProposalFinanceComponent(
        pfc: ProposalFinancialComponent
    ): ProposalFinancialComponent {

        verifyAndCreatePromoter(pfc)

        createPartnerships(pfc)

        pfc.id = proposalFinancialRepository.save(pfc).awaitSingle().id

        createValidations(pfc)

        pfc.protocol = protocolService.createProtocol(pfc.id!!)

        return pfc
    }

    private suspend fun createFile(file: FilePart): FileInfo {
        val path = FILES_DIR(file.filename())
        val getFileInfo = { FileInfo(fileName = path.name, filePath = path.pathString, fileSize = path.fileSize()) }
        //store file locally
        file.transferTo(path).awaitSingleOrNull()
        //save file information in db
        return fileInfoRepository.save(getFileInfo()).awaitSingle()
    }

    private suspend fun createValidations(pfc: ProposalFinancialComponent) {
        val validations = listOf(
            Validation(pfcId = pfc.id, validationType = ValidationType.FINANCE_DEP),
            Validation(pfcId = pfc.id, validationType = ValidationType.JURIDICAL_DEP)
        )

        pfc.validations = validationsRepository.saveAll(validations)
    }

    private fun createPartnerships(
        pfc: ProposalFinancialComponent
    ) {
        val promoterPartnership = Flux.just(Partnership(name = pfc.promoter!!.name, email = pfc.promoter!!.email))
        val partnerships =
            (if(pfc.partnerships != null)
                Flux.merge(promoterPartnership, pfc.partnerships)
            else
                promoterPartnership
            )
            .map {
                    it.financeComponentId = pfc.id!!
                    it
                }
        pfc.partnerships = partnershipService.saveAll(partnerships)
    }

    private suspend fun verifyAndCreatePromoter(pfc: ProposalFinancialComponent) {
        if (pfc.proposalId == null)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O identificador da proposta não pode vir em branco!")
        if (pfc.promoter == null && pfc.promoterId == null)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O promotor tem de ser especificado!")
        val promoter = promoterRepository.findByEmail(pfc.promoter!!.email!!).awaitSingleOrNull()
        if (promoter == null) {
            pfc.promoter = promoterRepository.save(pfc.promoter!!).awaitSingle()
        } else {
            pfc.promoter = promoter
        }
        pfc.promoterId = pfc.promoter!!.id!!

    }

    override suspend fun findComponentByProposalId(pid: Int, loadProtocol: Boolean): ProposalFinancialComponent {
        val component = proposalFinancialRepository.findByProposalId(pid).awaitFirstOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Nenhum componente financeiro foi encontrado para a proposta [$pid]!")
        return loadRelations(component, loadProtocol)
    }

    override suspend fun createCF(file: FilePart, pfcId: Int): FileInfo {
        val pfc = proposalFinancialRepository.findById(pfcId).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O componente financeiro [$pfcId] não existe!")

        if(pfc.financialContractId !== null) {

            val fileToDelete = fileInfoRepository.findById(pfc.financialContractId!!).awaitSingleOrNull()
            if(fileToDelete !== null) {
                //delete old file
                fileInfoRepository.deleteById(fileToDelete.id!!).awaitSingleOrNull()
                logger.info { "File ${fileToDelete.fileName} with Id ${fileToDelete.id!!} deleted." }
            }
        }
        val fileInfo = createFile(file)

        //update pfc with new id
        pfc.financialContractId = fileInfo.id
        proposalFinancialRepository.save(pfc).awaitSingle()


        //FIXME MAYBE ADD A THREADPOOL TO CLEAN UP THE SYSTEM
        // MAYBE EVEN ANOTHER APP THAT CONNECTS TO A DATABASE THAT STORES THE DELETED FILES AND
        // RUNS EVERY 30 MIN TO CLEAN UP FILES
//        (Thread {
//            withContext(Dispatchers.IO) {
//                Files.deleteIfExists(Paths.get(fileToDelete.filePath!!))
//            }
//        }).start()


        logger.info { "File created at ${fileInfo.filePath}" }
        return fileInfo
    }

    override suspend fun getCF(pfcId: Int): Path {
        val fileInfo = fileInfoRepository.findByPfcId(pfcId).awaitSingleOrNull()
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "O ficheiro pedido não existe!")
        return Path(fileInfo.filePath!!)
    }

    override suspend fun findAll(): Flow<ProposalFinancialComponent> {
        return proposalFinancialRepository.findAll().asFlow().map(this::loadRelations)
    }

    override suspend fun isValidated(pfcId: Int): Boolean {
        return validationsRepository.isPfcValidatedByPfcId(pfcId).awaitSingle()
    }

    override suspend fun validate(pfcId: Int, validationComment: ValidationComment): ValidationComment {
        if(!validationComment.newValidation!!) return validationComment
        val validation = validationsRepository.findByPfcIdAndValidationType(pfcId, validationComment.validation!!.validationType!!).awaitSingle()
        validation.validated = true
        validation.validationDate = LocalDateTime.now()
        validation.commentRef = validationComment.comment!!.id
        validationComment.validation = validationsRepository.save(validation).awaitSingle()
        return validationComment
    }

    private suspend fun loadRelations(pfc: ProposalFinancialComponent, loadProtocol: Boolean = false): ProposalFinancialComponent {
        pfc.promoter = promoterRepository.findById(pfc.promoterId!!).awaitSingleOrNull()
        pfc.partnerships = partnershipService.findAllByProposalFinancialComponentId(pfc.id!!)
        pfc.validations = validationsRepository.findAllByPfcId(pfc.id!!)
        if(loadProtocol) {
            pfc.protocol = protocolService.getProtocolDetails(pfc.proposalId!!,pfc.id!!).protocol
        }
        return pfc
    }
}