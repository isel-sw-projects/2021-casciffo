--TABLES
drop table if exists user_notification;
drop table if exists proposal_files;
drop table if exists timeline_event;
drop table if exists protocol_comments;
drop table if exists protocol;
drop table if exists validations;
drop table if exists proposal_financial_component;
drop table if exists proposal_comments;
drop table if exists promoter;
drop table if exists partnerships;
drop table if exists dossier;
drop table if exists scientific_activities;
drop table if exists visit_assigned_investigators;
drop table if exists clinical_visit;
drop table if exists research_participants;
drop table if exists participant;
drop table if exists research_team_financial_scope;
drop table if exists research_finance_row;
drop table if exists research_financial_component;
drop table if exists state_transition;
drop table if exists addenda_comment;
drop table if exists addenda;
drop table if exists files;
drop table if exists investigation_team;
drop table if exists proposal CASCADE;
drop table if exists clinical_research;
drop table if exists service;
drop table if exists state_roles;
drop table if exists next_possible_states;
drop table if exists type_of_states;
drop table if exists states;
drop table if exists pathology;
drop table if exists therapeutic_area;
drop table if exists user_roles;
drop table if exists user_account;
drop table if exists roles;

--TRIGGERS
DROP TRIGGER IF EXISTS t_update_last_modified ON proposal_comments;
drop trigger if exists t_validate_comment on proposal_comments;
drop trigger if exists t_update_last_modified on proposal;

--FUNCTIONS
drop function if exists f_update_last_modified_column;
drop function if exists f_validate_comment;
