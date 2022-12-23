-- GET VISITS AND THEIR ASSIGNED INVESTIGATORS FOR RESEARCH 1
SELECT cv.*
     , rp.treatment_branch
     , p.*
     , vai.id as visit_investigator_id, vai.investigator_id
     , ua.user_name as investigator_name, ua.user_email as investigator_email
FROM clinical_visit cv
         JOIN research_participants rp on cv.research_patient_id = rp.id
         JOIN participant p on rp.participant_id = p.id
         JOIN visit_assigned_investigators vai on cv.visit_id = vai.visit_id
         JOIN user_account ua on ua.user_id = vai.investigator_id
WHERE cv.research_id=1;


-- FIND EVENTS BETWEEN THE STATED DATE RANGE
SELECT tle.*
FROM timeline_event tle
WHERE tle.deadline_date >= '2022-10-30' AND tle.deadline_date <= '2022-11-05'
   OR completed_date >= '2022-10-30' AND tle.completed_date <= '2022-11-05';

-- CHECK IF CANCELED STATE IS TERMINAL
SELECT *--CASE WHEN COUNT(S) > 0 THEN TRUE ELSE FALSE END
FROM states S
         JOIN next_possible_states nps on S.state_id = nps.origin_state_id
WHERE nps.origin_state_id=19 AND nps.state_type='FINANCE_PROPOSAL' AND nps.state_flow_type='TERMINAL'
   OR s.state_name='CANCELADO' AND s.state_id=19;


-- FIND TERMINAL STATE FOR RESEARCH
SELECT *
FROM states s
         JOIN next_possible_states ns
              ON s.state_id = ns.origin_state_id
WHERE ns.state_type = 'RESEARCH';


--SEARCH IN ALL PATIENTS BY PROCESS ID
SELECT *
FROM participant p
WHERE CAST(p.process_id AS VARCHAR) LIKE '1%';


-- SELECT ALL PATIENTS ASSOCIATED TO A RESEARCH
SELECT cv.*
     , p.*
     , vai.id as visit_investigator_id, vai.investigator_id
     , ua.user_name as investigator_name, ua.user_email as investigator_email
FROM clinical_visit cv
         JOIN participant p on cv.research_patient_id = p.id
         JOIN visit_assigned_investigators vai on cv.visit_id = vai.visit_id
         JOIN user_account ua on ua.user_id = vai.investigator_id
WHERE cv.research_id=1;

--CHECK PFC VALIDATIONS BASED ON PROPOSAL ID
SELECT COUNT(*) = 0 as validaded
FROM validations v
         JOIN proposal_financial_component pfc on pfc.proposal_financial_id = v.pfc_id
WHERE v.validated = FALSE AND pfc.proposal_id=3;

--GET RESEARCH AGGREGATES
SELECT cr.*,
       p.sigla,
       p.proposal_id,
       state.state_name, state.state_id,
       st.service_name, st.service_id,
       ta.therapeutic_area_name, ta.therapeutic_area_id,
       pl.pathology_name, pl.pathology_id,
       pinv.user_id, pinv.user_name, pinv.user_email,
       pr.promoter_name
FROM clinical_research cr
        JOIN proposal_research propr on cr.research_id = propr.research_id
        JOIN proposal p on cr.research_id = propr.proposal_id
        JOIN pathology pl ON p.pathology_id = pl.pathology_id
        JOIN service st ON st.service_id = p.service_id
        JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id
        JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id
        JOIN states state ON cr.research_state_id = state.state_id
        LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id
        LEFT JOIN promoter pr ON pfc.promoter_id = pr.promoter_id
WHERE cr.type='CLINICAL_TRIAL';

--IS PFC FULLY VALIDATED
SELECT CASE WHEN COUNT(*) > 0 THEN FALSE ELSE TRUE END
FROM validations v
         JOIN protocol p on v.pfc_id = p.pfc_id
WHERE (v.validated = FALSE AND v.pfc_id=3) OR (p.validated = false AND p.pfc_id=3);

--FINANCE AND JURIDICAL OK
SELECT CASE WHEN COUNT(*) > 0 THEN FALSE ELSE TRUE END
FROM validations v
         JOIN protocol p on v.pfc_id = p.pfc_id
WHERE (v.validated = FALSE AND v.pfc_id=2) OR (p.validated = false AND p.pfc_id=2);

--FIND INITAL STATE BY CHAIN TYPE
SELECT s.*
FROM states s
         JOIN next_possible_states nps ON s.state_id = nps.origin_state_id
WHERE nps.state_flow_type='INITIAL' AND nps.state_type='STUDY_PROPOSAL';


--SEARCH USER BY ROLE AND NAME
SELECT ua.*
FROM user_account ua
         JOIN user_roles ur on ua.user_id = ur.user_id
         JOIN roles r on ur.role_id = r.role_id
WHERE UPPER(r.role_name) IN ('SUPERUSER', 'UIC') AND LOWER(ua.user_name) LIKE LOWER('adm%');

--GET ALL USERS AND THEIR ROLES
SELECT ua.user_id, ua.user_name, ua.user_email, r.role_id, r.role_name
FROM user_account ua
         LEFT JOIN user_roles ur on ua.user_id = ur.user_id
         LEFT JOIN roles r on ur.role_id = r.role_id;

--GET STATE TRANSITIONS BASED ON REF ID AND TYPE
SELECT st.*, s.state_name as previous_state_name, ns.state_name as next_state_name
FROM state_transition st
         JOIN states s on s.state_id = st.state_id_before
         JOIN states ns on ns.state_id = st.state_id_after
WHERE st.reference_id=2 and st.transition_type='FINANCE_PROPOSAL';

--VERIFY PROPOSAL FOREIGN KEYS
SELECT CASE WHEN COUNT(id)=4 THEN TRUE ELSE FALSE END
FROM (
     SELECT p.pathology_id as id
     FROM pathology p
     WHERE p.pathology_id=1
     UNION ALL
     SELECT st.service_id as id
     FROM service st
     WHERE st.service_id=1
     UNION ALL
     SELECT ta.therapeutic_area_id as id
     FROM therapeutic_area ta
     WHERE ta.therapeutic_area_id=1
     UNION ALL
     SELECT ua.user_id as id
     FROM user_account ua
     WHERE ua.user_id=1
 ) as pisi;







--GET state chain
SELECT nps.state_type, s.state_id, s.state_name, nps.next_state_id, ns.state_name as next_state_name
FROM states s
         JOIN next_possible_states nps on s.state_id = nps.origin_state_id
         LEFT JOIN states ns on ns.state_id = nps.next_state_id
ORDER BY nps.state_type;

--GET state chain plus roles
SELECT nps.state_type, s.state_id, s.state_name, nps.next_state_id, ns.state_name as next_state_name, r.role_name, r.role_id, nps.state_flow_type
FROM states s
         JOIN next_possible_states nps on s.state_id = nps.origin_state_id
         LEFT JOIN states ns on ns.state_id = nps.next_state_id
         JOIN state_roles sr on s.state_id = sr.state_id
         JOIN roles r on sr.role_id = r.role_id;

SELECT p.*,
       pfc.proposal_financial_id, pfc.financial_contract_id, pfc.promoter_id, pfc.has_partnerships,
       state.state_name, st.service_name, ta.therapeutic_area_name, pl.pathology_name,
       pinv.user_name, pinv.user_email, pr.promoter_name, pr.promoter_email, prot.protocol_id,
       prot.validated, prot.validated_date
FROM proposal p
         JOIN pathology pl ON p.pathology_id = pl.pathology_id
         JOIN service st ON st.service_id = p.service_id
         JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id
         JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id
         JOIN states state ON p.state_id = state.state_id
         LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id
         LEFT JOIN promoter pr ON pfc.promoter_id = pr.promoter_id
         LEFT JOIN protocol prot on pfc.proposal_financial_id = prot.pfc_id
WHERE p.proposal_id = 5;

SELECT CASE WHEN COUNT(S) > 0 THEN TRUE ELSE FALSE END
FROM states S
         JOIN next_possible_states nps on S.state_id = nps.origin_state_id
WHERE nps.origin_state_id=7 AND nps.state_type='ADDENDA' AND nps.state_flow_type='TERMINAL';

--GET proposals
SELECT p.proposal_id, p.sigla, p.created_date, p.last_modified, p.proposal_type,
       state_name, service_name, pathology_name, therapeutic_area_name, has_partnerships,
       promoter_name, user_name, prot.protocol_id, prot.validated, prot.validated_date
FROM proposal p
         JOIN states state ON p.state_id = state.state_id
         JOIN pathology pl ON p.pathology_id = pl.pathology_id
         JOIN service st ON st.service_id = p.service_id
         JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id
         JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id
         LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id
         LEFT JOIN promoter pr ON pr.promoter_id = pfc.promoter_id
         LEFT JOIN protocol prot on pfc.proposal_financial_id = prot.pfc_id
WHERE p.proposal_type = 'CLINICAL_TRIAL';

--GET proposal details in aggregate form
SELECT p.*,
       pfc.proposal_financial_id, pfc.financial_contract_id, pfc.promoter_id, pfc.has_partnerships,
       state.state_name, st.service_name, ta.therapeutic_area_name, pl.pathology_name,
       pinv.user_name, pinv.user_email, pr.promoter_name, pr.promoter_email, prot.protocol_id,
       prot.validated, prot.validated_date
FROM proposal p
         JOIN pathology pl ON p.pathology_id = pl.pathology_id
         JOIN service st ON st.service_id = p.service_id
         JOIN therapeutic_area ta ON ta.therapeutic_area_id = p.therapeutic_area_id
         JOIN user_account pinv ON p.principal_investigator_id = pinv.user_id
         JOIN states state ON p.state_id = state.state_id
         LEFT JOIN proposal_financial_component pfc ON p.proposal_id = pfc.proposal_id
         LEFT JOIN promoter pr ON pfc.promoter_id = pr.promoter_id
         LEFT JOIN protocol prot on pfc.proposal_financial_id = prot.pfc_id
WHERE p.proposal_id = 9;


--Get next state for proposal
SELECT s.*
FROM states s
         JOIN next_possible_states nps ON s.state_id = nps.next_state_id
         JOIN proposal p ON nps.origin_state_id = p.state_id
WHERE p.proposal_id=5 AND nps.state_type='FINANCE_PROPOSAL';
