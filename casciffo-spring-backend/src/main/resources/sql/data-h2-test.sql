-- ROLES
INSERT INTO roles(role_name) VALUES ('SUPERUSER'), ('CA'), ('UIC'), ('FINANCE'), ('JURIDICAL');

-- USERS
INSERT INTO user_account(user_name, user_email, user_password)
    VALUES ('admin', 'admin@admin.pt', '$2a$10$2X2vmd5NthkKodbVnEGw8./LW0pdx46vr8MqlCg2tc742rPRbDwgG'),
           ('Fernando', 'Fernando@casciffo.pt', '$2a$10$2X2vmd5NthkKodbVnEGw8./LW0pdx46vr8MqlCg2tc742rPRbDwgG'),
           ('admin', 'admin.diferente@casciffo.pt', '$2a$10$2X2vmd5NthkKodbVnEGw8./LW0pdx46vr8MqlCg2tc742rPRbDwgG'),
           ('José', 'jose.guerreiro@casciffo.pt', '$2a$10$2X2vmd5NthkKodbVnEGw8./LW0pdx46vr8MqlCg2tc742rPRbDwgG');

--USER ROLES
INSERT INTO user_roles(user_id, role_id)
    VALUES (1, 1),
           (2, 2),
           (3, 1),
           (4, 4);


-- STATES
INSERT INTO states(state_name)
    VALUES ('SUBMETIDO'),
           ('VALIDACAO_CF'),
           ('VALIDACAO_EXTERNA'),
           ('SUBMISSAO_AO_CA'),
           ('VALIDACAO_INTERNA_CA'),
           ('VALIDADO'),
           ('ATIVO'),
           ('COMPLETO'),
           ('CANCELADO');

--LINK STATES WITH ROLES
INSERT INTO state_roles(state_id, role_id)
    VALUES (1, 3),                      --SUBMETIDO                         UIC
           (2, 4),                      --VALIDACAO_CF                      FINANCE
           (2, 5),                      --VALIDACAO_CF                      JURIDICAL
           (3, 3),                      --VALIDACAO_EXTERNA                 UIC
           (3, 1),                      --VALIDACAO_EXTERNA                 SUPERUSER
           (4, 3),                      --SUBMISSAO_AO_CA                   UIC
           (4, 1),                      --SUBMISSAO_AO_CA                   SUPERUSER
           (5, 2),                      --VALIDAO_INTERNA_CA                CA
           (6, 1),                      --VALIDADO                          SUPERUSER
           (8, 1),                      --COMPLETO                          SUPERUSER
           (9, 1),                     --CANCELADO                         SUPERUSER
           (7, 3),                      --ATIVO                             UIC
           (7, 1),                      --ATIVO                             SUPERUSER
           (1, 1),                      --SUBMETIDO                         SUPERUSER
           (2, 1),                      --VALIDACAO_CF                      SUPERUSER
           (3, 1),                      --VALIDACAO_EXTERNA                 SUPERUSER
           (4, 1),                      --SUBMISSAO_AO_CA                   SUPERUSER
           (5, 1);                      --VALIDAO_INTERNA_CA                SUPERUSER

--NEXT STATES
INSERT INTO next_possible_states(origin_state_id, next_state_id, state_type, state_flow_type)
VALUES
    --FINANCE PROPOSAL
    (1, 2, 'FINANCE_PROPOSAL', 'INITIAL'),
    (2, 3, 'FINANCE_PROPOSAL', 'PROGRESS'),
    (3, 4, 'FINANCE_PROPOSAL', 'PROGRESS'),
    (4, 5, 'FINANCE_PROPOSAL', 'PROGRESS'),
    (5, 6, 'FINANCE_PROPOSAL', 'PROGRESS'),
    (6, NULL, 'FINANCE_PROPOSAL', 'TERMINAL'),
    --STUDY PROPOSAL
    (1, 5, 'STUDY_PROPOSAL', 'INITIAL'),
    (5, 6, 'STUDY_PROPOSAL', 'PROGRESS'),
    (6, NULL, 'STUDY_PROPOSAL', 'TERMINAL'),
    --ADDENDA
    (1, 5, 'ADDENDA', 'INITIAL'),
    (5, 6, 'ADDENDA', 'PROGRESS'),
    (6, NULL, 'ADDENDA', 'TERMINAL'),
    --ENSAIO
    (1, 7, 'RESEARCH', 'INITIAL'),
    (7, 8, 'RESEARCH', 'PROGRESS'),
    (8, NULL, 'RESEARCH', 'TERMINAL'),
    --ALL
    (9, NULL, 'ALL', TRUE);

--SOME CONSTANTS
INSERT INTO service(service_name) VALUES ('Cardiologia');
INSERT INTO pathology(pathology_name) VALUES ('Pneumonia');
INSERT INTO therapeutic_area(therapeutic_area_name) VALUES ('Terapia Cardio');

--PROPOSAL
INSERT INTO
    proposal(state_id, pathology_id, service_id, therapeutic_area_id, sigla, principal_investigator_id, proposal_type)
    VALUES (1, 1, 1, 1,'APOLLO',1,'CLINICAL_TRIAL'),
           (1, 1, 1, 1,'Observações',1,'OBSERVATIONAL_STUDY');

INSERT INTO
    timeline_event (proposal_id, event_type, event_name, event_description, deadline_date, completed_date)
    VALUES (1, 'DEADLINE', 'Testing overdue deadline routine', 'Title says it all', '2022-01-01');

--INVESTIGATION TEAM
INSERT INTO investigation_team(proposal_id, member_role, member_id) VALUES (1, 'PRINCIPAL', 1);
INSERT INTO investigation_team(proposal_id, member_role, member_id) VALUES (1, 'MEMBER', 2);
INSERT INTO investigation_team(proposal_id, member_role, member_id) VALUES (1, 'MEMBER', 3);

--PROPOSAL COMMENTS
INSERT INTO proposal_comments(proposal_id, author_id, content, comment_type)
    VALUES (1, 1, 'Early bird gets the worm', 'CONTACTS'),
           (1, 1, 'An observation made for testing purposes', 'OBSERVATIONS');

--PROPOSAL FINANCIAL COMPONENT
INSERT INTO files(file_name, file_path, file_size)
    VALUES ('contrato-apollo-trial-pfizer', '[DRIVE]:\\PATH\TO\FILE', 51235);

INSERT INTO promoter(promoter_name, promoter_type, promoter_email)
    VALUES ('PFIZER', 'COMMERCIAL', 'pfizer.no.more.@covid.com');

INSERT INTO proposal_financial_component(proposal_id, financial_contract_id, promoter_id) VALUES (1, 1, 1);

INSERT INTO validations(pfc_id, comment_ref, validation_type, validation_date)
VALUES (1, NULL, 'FINANCE_DEP', NULL),(1, NULL, 'JURIDICAL_DEP', NULL);

--PARTNERSHIPS
INSERT INTO partnerships(proposal_financial_id, icon_url, representative, email, phone_contact, site_url, name)
    VALUES (1, 'https://cdn-icons-png.flaticon.com/512/3698/3698156.png', 'ze manel',
            'ze.manel@home.pt','923722883', 'https://www.example.com/', 'An amazing partnership');

--PROTOCOL
INSERT INTO protocol(validated, validated_date, pfc_id) VALUES (FALSE, NULL, 1);


--CLINICAL TRIALS
INSERT INTO clinical_research(proposal_id, research_state_id, type)
    VALUES (1, (SELECT state_id FROM states WHERE state_name = 'ATIVO'), 'CLINICAL_TRIAL')