-- ROLES
INSERT INTO roles(role_name) VALUES ('SUPERUSER'), ('CA'), ('UIC'), ('FINANCE');

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

--LINK STATES WITH ROLES
INSERT INTO state_roles(state_id, role_id)
    VALUES (1, 3),
           (1, 1),
           (2, 3),
           (2, 1),
           (3, 4),
           (3, 1),
           (4, 3),
           (4, 1),
           (5, 3),
           (5, 1),
           (6, 2),
           (6, 1),
           (7, 1),
           (8, 1),
           (9, 1),
           (10, 2),
           (10, 1);

--SOME CONSTANTS
INSERT INTO service(service_name) VALUES ('Cardiologia');
INSERT INTO pathology(pathology_name) VALUES ('Pneumonia');
INSERT INTO therapeutic_area(therapeutic_area_name) VALUES ('Terapia Cardio');

--PROPOSAL
INSERT INTO
    proposal(state_id, pathology_id, service_id, therapeutic_area_id, sigla, principal_investigator_id, proposal_type)
    VALUES (1, 1, 1, 1,'APOLLO',1,'CLINICAL_TRIAL'),
           (1, 1, 1, 1,'Observações',1,'OBSERVATIONAL_STUDY');

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
INSERT INTO protocol(is_validated, validated_date, pfc_id) VALUES (FALSE, NULL, 1);

--CLINICAL TRIALS
INSERT INTO clinical_research(proposal_id, research_state_id, type)
    VALUES (1, (SELECT state_id FROM states WHERE state_name = 'ATIVO'), 'CLINICAL_TRIAL')