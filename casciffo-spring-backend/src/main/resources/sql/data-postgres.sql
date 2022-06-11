DO $$
DECLARE
    uic_role_id INT;
    ca_role_id INT;
    finance_role_id INT;
    superuser_role_id INT;
    first_admin_id INT;
    second_admin_id INT;
    uic_user_id INT;
    finance_user_id INT;
    var_service_id INT;
    var_therapeuticArea_id INT;
    var_pathology_id INT;
    submetido_state_id INT;
    var_proposal_id INT;
    var_pfc_id INT;
    var_file_id INT;
    var_promoter_id INT;
    var_partnership_id INT;
    var_protocol_id INT;
BEGIN
    -- ROLES
    INSERT INTO user_role(role_name) VALUES ('SUPERUSER'), ('CA'), ('UIC'), ('FINANCE');
    uic_role_id := (SELECT role_id FROM user_role WHERE role_name='UIC' LIMIT 1);
    ca_role_id := (SELECT role_id FROM user_role WHERE role_name='CA' LIMIT 1);
    finance_role_id := (SELECT role_id FROM user_role WHERE role_name='FINANCE' LIMIT 1);
    superuser_role_id := (SELECT role_id FROM user_role WHERE role_name='SUPERUSER' LIMIT 1);

    -- USERS
    INSERT INTO user_account(user_name, user_email, password, user_role_id)
    VALUES ('admin', 'admin@admin.pt', '123456', superuser_role_id),
           ('Fernando', 'Fernando@casciffo.pt', '123456', uic_role_id),
           ('admin', 'admin.diferente@casciffo.pt', '123456', superuser_role_id),
           ('José', 'jose.guerreiro@casciffo.pt', '123456', superuser_role_id);

    first_admin_id := (SELECT user_id FROM user_account WHERE user_email='admin@admin.pt' LIMIT 1);
    second_admin_id := (SELECT user_id  FROM user_account WHERE user_email='admin.diferente@casciffo.pt' LIMIT 1);
    uic_user_id := (SELECT user_id  FROM user_account WHERE user_email='Fernando@casciffo.pt' LIMIT 1);
    finance_user_id := (SELECT user_id  FROM user_account WHERE user_email='jose.guerreiro@casciffo.pt' LIMIT 1);

    -- STATES
    INSERT INTO states(state_name, role_responsible_for_advancing_id)
    VALUES ('SUBMETIDO', uic_role_id),
           ('NEGOCIACAO_DE_CF', uic_role_id),
           ('VALIDACAO_INTERNA_DEPARTMENTS', finance_role_id),
           ('VALIDACAO_EXTERNA', uic_role_id),
           ('SUBMISSAO_AO_CA', uic_role_id),
           ('VALIDACAO_INTERNA_CA', ca_role_id),
           ('VALIDADO', superuser_role_id),
           ('CANCELADO', superuser_role_id),
           ('COMPLETO', superuser_role_id),
           ('ATIVO', uic_role_id);

    submetido_state_id := (SELECT state_id FROM states WHERE state_name='SUBMETIDO' LIMIT 1);

    --SOME CONSTANTS
    INSERT INTO service(service_name) VALUES ('Cardiologia') RETURNING service_id INTO var_service_id;
    INSERT INTO pathology(pathology_name) VALUES ('Pneumonia') RETURNING pathology_id INTO var_pathology_id;
    INSERT INTO therapeutic_area(therapeutic_area_name)
        VALUES ('Terapia Cardio') RETURNING therapeutic_area_id INTO var_therapeuticArea_id;

    --PROPOSAL
    INSERT INTO
        proposal(state_id, pathology_id, service_id, therapeutic_area_id, sigla, principal_investigator_id, proposal_type)
        VALUES (submetido_state_id, var_pathology_id, var_service_id,
                    var_therapeuticArea_id,'Observações',uic_user_id,'OBSERVATIONAL_STUDY'),
                (submetido_state_id, var_pathology_id, var_service_id,
                    var_therapeuticArea_id,'APOLLO',first_admin_id,'CLINICAL_TRIAL');

    var_proposal_id := (SELECT proposal_id FROM proposal WHERE proposal_type='CLINICAL_TRIAL' LIMIT 1);

    --INVESTIGATION TEAM
    INSERT INTO investigation_team(proposal_id, member_role, member_id) VALUES (var_proposal_id, 'PRINCIPAL', first_admin_id);
    INSERT INTO investigation_team(proposal_id, member_role, member_id) VALUES (var_proposal_id, 'MEMBER', uic_user_id);
    INSERT INTO investigation_team(proposal_id, member_role, member_id) VALUES (var_proposal_id, 'MEMBER', second_admin_id);

    --PROPOSAL COMMENTS
    INSERT INTO proposal_comments(proposal_id, author_id, content, comment_type)
        VALUES (var_proposal_id, first_admin_id, 'Early bird gets the worm', 'CONTACTS'),
               (var_proposal_id, first_admin_id, 'An observation made for testing purposes', 'OBSERVATIONS');

    --PROPOSAL FINANCIAL COMPONENT
    INSERT INTO files(file_name, file_path, file_size)
        VALUES ('contrato-apollo-trial-pfizer', '[DRIVE]:\\PATH\TO\FILE', 51235) RETURNING file_id INTO var_file_id;

    INSERT INTO promoter(name, promoter_type, email)
        VALUES ('PFIZER', 'COMMERCIAL', 'pfizer.no.more.@covid.com') RETURNING promoter_id INTO var_promoter_id;

    INSERT
    INTO proposal_financial_component(proposal_id, financial_contract_id, promoter_id)
        VALUES (var_proposal_id, var_file_id, var_promoter_id) RETURNING proposal_financial_id INTO var_pfc_id;

    --PARTNERSHIPS
    INSERT INTO partnerships(proposal_financial_id, icon_url, representative, email, phone_contact, site_url, name)
        VALUES (var_pfc_id, 'https://cdn-icons-png.flaticon.com/512/3698/3698156.png', 'ze manel',
                'ze.manel@home.pt','923722883', 'https://www.example.com/', 'An amazing partnership')
        RETURNING partnership_id INTO var_partnership_id;

    --PROTOCOL
    INSERT INTO protocol(is_validated, validated_date, pfc_id)
        VALUES (FALSE, NULL, var_pfc_id) RETURNING protocol_id INTO var_protocol_id;

    --TIMELINE EVENTS

END $$;


--DELETE FROM proposal where proposal_id = 1