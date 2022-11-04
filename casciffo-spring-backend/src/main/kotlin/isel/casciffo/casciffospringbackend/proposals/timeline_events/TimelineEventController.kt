package isel.casciffo.casciffospringbackend.proposals.timeline_events

import isel.casciffo.casciffospringbackend.common.TimeType
import isel.casciffo.casciffospringbackend.endpoints.NEAREST_EVENTS_URL
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_COMPLETE_EVENTS_URL
import isel.casciffo.casciffospringbackend.endpoints.PROPOSAL_EVENTS_URL
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
class TimelineEventController(
    @Autowired val service: TimelineEventService
) {

    @GetMapping(NEAREST_EVENTS_URL)
    suspend fun getClosestEventsBy(@RequestParam t: TimeType): Flow<TimelineEventModel> {
        return service.findClosestEventsBy(t)
    }

    @GetMapping(PROPOSAL_EVENTS_URL)
    suspend fun getEventsByProposalId(
        @PathVariable proposalId: Int
    ) : Flow<TimelineEventModel>
    {
        return service.findAllByProposalId(proposalId)
    }

    @PostMapping(PROPOSAL_EVENTS_URL)
    suspend fun createEvent(
        @PathVariable proposalId: Int,
        @RequestBody timelineEventModel: TimelineEventModel
    ): TimelineEventModel
    {
        return service.createEvent(event = timelineEventModel, proposalId = proposalId)
    }

    @PutMapping(PROPOSAL_COMPLETE_EVENTS_URL)
    suspend fun updateEvent(
        @PathVariable proposalId: Int,
        @PathVariable eventId: Int,
        @RequestParam(defaultValue = "false") complete: Boolean
    ): TimelineEventModel {
        return service.updateEvent(proposalId, eventId, complete)
    }
}