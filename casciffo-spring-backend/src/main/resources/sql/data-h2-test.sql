-- ROLES
INSERT INTO roles(role_name) VALUES ('SUPERUSER'), ('CA'), ('UIC'), ('FINANCE'), ('JURIDICAL');

-- USERS
INSERT INTO user_account(user_name, user_email, user_password)
    VALUES ('admin', 'admin@admin.pt', '123456'),
           ('Fernando', 'Fernando@casciffo.pt', '123456'),
           ('admin', 'admin.diferente@casciffo.pt', '123456'),
           ('José', 'jose.guerreiro@casciffo.pt', '123456');

--USER ROLES
INSERT INTO user_roles(user_id, role_id)
    VALUES (1, 1),
           (2, 2),
           (3, 1),
           (4, 4);


-- STATES
INSERT INTO states(state_name)
    VALUES ('SUBMETIDO'),
           ('NEGOCIACAO_DE_CF'),
           ('VALIDACAO_INTERNA_DEPARTMENTS'),
           ('VALIDACAO_EXTERNA'),
           ('SUBMISSAO_AO_CA'),
           ('VALIDACAO_INTERNA_CA'),
           ('VALIDADO'),
           ('CANCELADO'),
           ('COMPLETO'),
           ('ATIVO');

--TYPES OF STATES
INSERT INTO type_of_states(state_id, state_type)
    VALUES (1, 'FINANCE_PROPOSAL'),     --SUBMETIDO
           (1, 'PROPOSAL'),             --SUBMETIDO
           (1, 'ADDENDA'),              --SUBMETIDO
           (2, 'FINANCE_PROPOSAL'),     --NEGOCIACAO_DE_CF
           (3, 'FINANCE_PROPOSAL'),     --VALIDACAO_INTERNA_DEPARTMENTS
           (4, 'PROPOSAL'),             --VALIDACAO_EXTERNA
           (5, 'FINANCE_PROPOSAL'),     --SUBMISSAO_AO_CA
           (6, 'PROPOSAL'),             --VALIDAO_INTERNA_CA
           (6, 'ADDENDA'),              --VALIDAO_INTERNA_CA
           (7, 'PROPOSAL'),             --VALIDADO
           (7, 'ADDENDA'),              --VALIDADO
           (8, 'ALL'),                  --CANCELADO
           (9, 'ENSAIO'),               --COMPLETO
           (10, 'ENSAIO');              --ATIVO

--LINK STATES WITH ROLES
INSERT INTO state_roles(state_id, role_id)
    VALUES (1, 3),                      --SUBMETIDO                         UIC
           (2, 3),                      --NEGOCIACAO_DE_CF                  UIC
           (3, 4),                      --VALIDACAO_INTERNA_DEPARTMENTS     FINANCE
           (3, 5),                      --VALIDACAO_INTERNA_DEPARTMENTS     JURIDICAL
           (4, 3),                      --VALIDACAO_EXTERNA                 UIC
           (4, 1),                      --VALIDACAO_EXTERNA                 SUPERUSER
           (5, 3),                      --SUBMISSAO_AO_CA                   UIC
           (5, 1),                      --SUBMISSAO_AO_CA                   SUPERUSER
           (6, 2),                      --VALIDAO_INTERNA_CA                CA
           (7, 1),                      --VALIDADO                          SUPERUSER
           (8, 1),                      --CANCELADO                         SUPERUSER
           (9, 1),                      --COMPLETO                          SUPERUSER
           (10, 3),                     --ATIVO                             UIC
           (10, 1),                     --ATIVO                             SUPERUSER
           (1, 1),                      --SUBMETIDO                         SUPERUSER
           (2, 1),                      --NEGOCIACAO_DE_CF                  SUPERUSER
           (3, 1),                      --VALIDACAO_INTERNA_DEPARTMENTS     SUPERUSER
           (4, 1),                      --VALIDACAO_EXTERNA                 SUPERUSER
           (5, 1),                      --SUBMISSAO_AO_CA                   SUPERUSER
           (6, 1);                      --VALIDAO_INTERNA_CA                SUPERUSER

--NEXT STATES
INSERT INTO next_possible_states(origin_state_id, next_state_id, state_type, is_terminal_state)
VALUES
    --FINANCE PROPOSAL
    (1, 2, 'FINANCE_PROPOSAL', FALSE),
    (2, 3, 'FINANCE_PROPOSAL', FALSE),
    (3, 4, 'FINANCE_PROPOSAL', FALSE),
    (4, 5, 'FINANCE_PROPOSAL', FALSE),
    (5, 6, 'FINANCE_PROPOSAL', FALSE),
    (6, 7, 'FINANCE_PROPOSAL', FALSE),
    --STUDY PROPOSAL
    (1, 6, 'STUDY_PROPOSAL', FALSE),
    (6, 7, 'STUDY_PROPOSAL', FALSE),
    (7, NULL, 'STUDY_PROPOSAL', TRUE),
    --ADDENDA
    (1, 6, 'ADDENDA', FALSE),
    (6, 7, 'ADDENDA', FALSE),
    (7, NULL, 'ADDENDA', TRUE),
    --ENSAIO
    (10, 9, 'ENSAIO', FALSE),
    (9, NULL, 'ENSAIO', TRUE),
    --ALL
    (8, NULL, 'ALL', TRUE);

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

--PARTNERSHIPS
INSERT INTO partnerships(proposal_financial_id, icon_url, representative, email, phone_contact, site_url, name)
    VALUES (1, 'https://cdn-icons-png.flaticon.com/512/3698/3698156.png', 'ze manel',
            'ze.manel@home.pt','923722883', 'https://www.example.com/', 'An amazing partnership');

--PROTOCOL
INSERT INTO protocol(validated, validated_date, pfc_id) VALUES (FALSE, NULL, 1);


--CLINICAL TRIALS
INSERT INTO clinical_research(proposal_id, research_state_id, type)
    VALUES (1, (SELECT state_id FROM states WHERE state_name = 'ATIVO'), 'CLINICAL_TRIAL')