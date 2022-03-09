package isel.casciffo.casciffospringbackend.proposals

import isel.casciffo.casciffospringbackend.states.States
import isel.casciffo.casciffospringbackend.users.User
import lombok.AllArgsConstructor
import lombok.ToString
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@ToString
@AllArgsConstructor
@Table(value = "proposal")
class Proposal(
    @Id
    @Column(value = "proposal_id")
    var id: Int?,

    @Column(value = "sigla")
    var sigla: String,

    @Column(value = "proposal_type")
    var type: ProposalType,

    @Column(value = "date_created")//, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    @CreatedDate
    var dateCreated: LocalDateTime,

    @Column(value = "last_update")//, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    @LastModifiedDate
    var lastUpdated: LocalDateTime,

    @Column(value = "state_id")
    var stateId: Int,
    @Column(value = "service_id")
    var serviceTypeId: Int,
    @Column(value = "therapeutic_area_id")
    var therapeuticAreaId: Int,
    @Column(value = "pathology_id")
    var pathologyId: Int,
    @Column(value = "principal_investigator_id")
    var principalInvestigatorId: Int,

    @Transient
    var state : States?,

    @Transient
    var serviceType: ServiceType?,

    @Transient
    var therapeuticArea: TherapeuticArea?,

    @Transient
    var pathology: Pathology?,

    @Transient
    var principalInvestigator: User?,

    @Transient
    var investigationTeam: List<InvestigationTeam>?,

    @Transient
    var comments: List<ProposalComments>?,

    @Transient
    var financialComponent: ProposalFinancialComponent?
) {
    override fun toString(): String {
        return "Proposal:{\nid:${id},\nsigla:${sigla},\ntype:${type},\ndateCreated:${dateCreated}," +
                "\nlastModified:${lastUpdated},\nstateId:${stateId}\nserviceTypeId:${serviceTypeId}," +
                "\ntherapeuticAreaId:${therapeuticAreaId},\npathologyId:${pathologyId},\nstate:${state}," +
                "\nserviceType:${serviceType},\ntherapeuticArea:${therapeuticArea},\npathology:${pathology}" +
                ",\nteam:${investigationTeam?.toString()},\ncomments:${comments?.toString()}," +
                "\nfinancialComponent:${financialComponent}}"
    }
}
