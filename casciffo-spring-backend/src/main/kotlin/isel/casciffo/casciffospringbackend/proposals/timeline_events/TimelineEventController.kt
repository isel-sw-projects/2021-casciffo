package isel.casciffo.casciffospringbackend.proposals.timeline_events

import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_COMPLETE_EVENTS_URL
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_EVENTS_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class TimelineEventController(
    @Autowired val service: TimelineEventService
) {

    @GetMapping(PROPOSAL_EVENTS_URL)
    suspend fun getEventsByProposalId(
        @PathVariable(required = true) proposalId: Int
    ) : Flow<TimelineEventModel>
    {
        return service.findAllByProposalId(proposalId)
    }

    @PostMapping(PROPOSAL_EVENTS_URL)
    suspend fun createEvent(
        @PathVariable(required = true) proposalId: Int,
        @RequestBody(required = true) timelineEventModel: TimelineEventModel
    ): TimelineEventModel
    {
        return service.createEvent(event = timelineEventModel, proposalId = proposalId)
    }

    @PutMapping(PROPOSAL_COMPLETE_EVENTS_URL)
    suspend fun updateEvent(
        @PathVariable(required = true) proposalId: Int,
        @PathVariable(required = true) eventId: Int,
        @RequestParam(defaultValue = "false") complete: Boolean
    ): TimelineEventModel {
        return service.updateEvent(proposalId, eventId, complete)
    }
}