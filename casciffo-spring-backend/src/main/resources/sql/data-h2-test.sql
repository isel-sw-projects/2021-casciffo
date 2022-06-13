-- ROLES
INSERT INTO user_role(role_name) VALUES ('SUPERUSER'), ('CA'), ('UIC'), ('FINANCE');
-- USERS
INSERT INTO user_account(user_name, user_email, password, user_role_id)
    VALUES ('admin', 'admin@admin.pt', '123456', 1),
           ('Fernando', 'Fernando@casciffo.pt', '123456', 2),
           ('admin', 'admin.diferente@casciffo.pt', '123456', 1),
           ('José', 'jose.guerreiro@casciffo.pt', '123456', 4);

-- STATES
INSERT INTO states(state_name, role_responsible_for_advancing_id)
    VALUES ('SUBMETIDO', 3),
           ('NEGOCIACAO_DE_CF', 3),
           ('VALIDACAO_INTERNA_DEPARTMENTS', 4),
           ('VALIDACAO_EXTERNA', 3),
           ('SUBMISSAO_AO_CA', 3),
           ('VALIDACAO_INTERNA_CA', 2),
           ('VALIDADO', 1),
           ('CANCELADO', 1),
           ('COMPLETO', 1),
           ('ATIVO', 2);


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

INSERT INTO promoter(name, promoter_type, email)
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