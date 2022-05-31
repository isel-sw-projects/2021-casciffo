INSERT INTO files(file_name, file_path, file_size) VALUES ('contrato-apollo-trial-pfizer', 'some Url Or System Path', 51235);
INSERT INTO promoter(name, promoter_type, email) VALUES ('PFIZER', 'COMMERCIAL', 'pfizer.no.more.@covid.com');
INSERT INTO user_role(role_name) VALUES ('SUPERUSER'), ('UIC'), ('FINANCE'), ('CA');
INSERT INTO user_account(user_name, user_email, password, user_role_id) VALUES ('admin', 'admin@admin.pt', 'YWRtaW4=', 1);
INSERT INTO user_account(user_name, user_email, password, user_role_id) VALUES ('Fernando', 'Fernando@casciffo.pt', 'YWRtaW4=', 2);
INSERT INTO user_account(user_name, user_email, password, user_role_id) VALUES ('admin', 'Hamza@casciffo.pt', 'YWRtaW4=', 2);
INSERT INTO service(service_name) VALUES ('Cardiologia');
INSERT INTO pathology(pathology_name) VALUES ('Pneumonia');
INSERT INTO therapeutic_area(therapeutic_area_name) VALUES ('Terapia Cardio');
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('SUBMETIDO', 2);
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('NEGOCIACAO_DE_CF', 2);
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('VALIDACAO_INTERNA_DEPARTMENTS', 13);
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('VALIDACAO_EXTERNA', 2);
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('SUBMISSAO_AO_CA', 2);
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('VALIDACAO_INTERNA_CA', 14);
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('VALIDADO', 2);
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('CANCELADO', 1);
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('COMPLETO', 2);
INSERT INTO states(state_name, role_responsible_for_advancing_id) VALUES ('ATIVO', 2);
INSERT INTO
    proposal(state_id, pathology_id, service_id, therapeutic_area_id, protocol_state_id, sigla, principal_investigator_id, proposal_type)
        VALUES (1,1,1,1,NULL,'APOLLO',1,'CLINICAL_TRIAL');
INSERT
    INTO proposal_financial_component(proposal_id, financial_contract_id, promoter_id)
        VALUES (1, 1, 1);
INSERT INTO investigation_team(proposal_id, member_role, member_id) VALUES (1, 'PRINCIPAL', 1);
INSERT INTO investigation_team(proposal_id, member_role, member_id) VALUES (1, 'MEMBER', 2);
INSERT INTO investigation_team(proposal_id, member_role, member_id) VALUES (1, 'MEMBER', 3);
INSERT INTO proposal_comments(proposal_id, author_id, content, comment_type) VALUES (1, 2, 'Early bird gets the worm', 'CONTACTS');
INSERT INTO proposal_comments(proposal_id, author_id, content, comment_type) VALUES (1, 2, 'An observation made for testing purposes', 'OBSERVATIONS');
INSERT INTO partnerships(proposal_financial_id, icon_url, representative, email, phone_contact, site_url, name)
VALUES (1, 'a cool icon url', 'ze manel', 'ze.manel@home.pt','923722883', 'the best site url ever', 'An amazing partnership')

--DELETE FROM proposal where proposal_id = 1