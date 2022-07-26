package isel.casciffo.casciffospringbackend.mappers.research

import isel.casciffo.casciffospringbackend.aggregates.research.ResearchDetailAggregate
import isel.casciffo.casciffospringbackend.mappers.Mapper
import isel.casciffo.casciffospringbackend.research.research.ResearchModel
import isel.casciffo.casciffospringbackend.states.state.State
import org.springframework.stereotype.Component
import javax.naming.OperationNotSupportedException

@Component
class ResearchDetailAggregateMapper: Mapper<ResearchModel, ResearchDetailAggregate> {
    override suspend fun mapDTOtoModel(dto: ResearchDetailAggregate?): ResearchModel {
        TODO("NOT YET IMPLEMENTED")
    //        return if(dto == null) ResearchModel()
//        else ResearchModel(
//            id = dto.id,
//            proposalId = dto.proposalId,
//            stateId = dto.stateId,
//            eudra_ct = dto.eudra_ct,
//            sampleSize = dto.sampleSize,
//            duration = dto.duration,
//            cro = dto.cro,
//            startDate = dto.startDate,
//            endDate = dto.endDate,
//            estimatedEndDate = dto.estimatedEndDate,
//            industry = dto.industry,
//            protocol = dto.protocol,
//            initiativeBy = dto.initiativeBy,
//            phase = dto.phase,
//            type = dto.type,
//            state = State(id=dto.stateId, name = dto.stateName),
//            proposal = mapSimpleProposal(dto),
//            participants = null, //left null on purpose
//            stateTransitions = null //left null on purpose
//        )
    }

    override suspend fun mapModelToDTO(model: ResearchModel?): ResearchDetailAggregate {
        throw NotImplementedError("Left blank on purpose.")
    }
}