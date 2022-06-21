DO
$$
    DECLARE
        uic_role_id INT;
        ca_role_id INT;
        finance_role_id INT;
        superuser_role_id INT;
        first_admin_id INT;
        state_submetido_id INT;
        state_negociacao_cf_id INT;
        state_validacao_interna_deps_id INT;
        state_validacao_externa_id INT;
        state_submissao_ao_ca_id INT;
        state_validacao_interna_ca_id INT;
        state_validado_id INT;
        state_completo_id INT;
        state_cancelado_id INT;
        state_ativo_id INT;
    BEGIN

        -- ROLES
        INSERT INTO roles(role_name)
        VALUES ('SUPERUSER'), ('CA'), ('UIC'), ('FINANCE')
        ON CONFLICT (role_name) DO NOTHING;

        uic_role_id := (SELECT role_id FROM roles WHERE role_name='UIC' LIMIT 1);
        ca_role_id := (SELECT role_id FROM roles WHERE role_name='CA' LIMIT 1);
        finance_role_id := (SELECT role_id FROM roles WHERE role_name='FINANCE' LIMIT 1);
        superuser_role_id := (SELECT role_id FROM roles WHERE role_name='SUPERUSER' LIMIT 1);

        -- USERS password is 123456 encrypted
        INSERT INTO user_account(user_name, user_email, user_password)
        VALUES ('admin', 'casciffo.admin@admin.pt', '$2a$10$2X2vmd5NthkKodbVnEGw8./LW0pdx46vr8MqlCg2tc742rPRbDwgG')
        ON CONFLICT (user_email) DO NOTHING;

        first_admin_id := (SELECT user_id FROM user_account WHERE user_email='casciffo.admin@admin.pt' LIMIT 1);

        INSERT INTO user_roles(user_id, role_id)
        VALUES (first_admin_id, superuser_role_id)
        ON CONFLICT DO NOTHING;

        raise notice 'Value: %', first_admin_id;

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
               ('ATIVO')
        ON CONFLICT DO NOTHING;

        state_submetido_id := (SELECT state_id FROM states WHERE state_name = 'SUBMETIDO');
        state_negociacao_cf_id := (SELECT state_id FROM states WHERE state_name = 'NEGOCIACAO_DE_CF');
        state_validacao_interna_deps_id := (SELECT state_id FROM states WHERE state_name = 'VALIDACAO_INTERNA_DEPARTMENTS');
        state_validacao_externa_id := (SELECT state_id FROM states WHERE state_name = 'VALIDACAO_EXTERNA');
        state_submissao_ao_ca_id := (SELECT state_id FROM states WHERE state_name = 'SUBMISSAO_AO_CA');
        state_validacao_interna_ca_id := (SELECT state_id FROM states WHERE state_name = 'VALIDACAO_INTERNA_CA');
        state_validado_id := (SELECT state_id FROM states WHERE state_name = 'VALIDADO');
        state_completo_id := (SELECT state_id FROM states WHERE state_name = 'CANCELADO');
        state_cancelado_id := (SELECT state_id FROM states WHERE state_name = 'COMPLETO');
        state_ativo_id := (SELECT state_id FROM states WHERE state_name = 'ATIVO');

        -- STATE ROLES
        INSERT INTO state_roles(state_id, role_id)
        VALUES (state_submetido_id, uic_role_id),
               (state_negociacao_cf_id, uic_role_id),
               (state_validacao_interna_deps_id, finance_role_id),
               (state_validacao_externa_id, uic_role_id),
               (state_submissao_ao_ca_id, uic_role_id),
               (state_validacao_interna_ca_id, ca_role_id),
               (state_validado_id, superuser_role_id),
               (state_completo_id, superuser_role_id),
               (state_cancelado_id, superuser_role_id),
               (state_ativo_id, uic_role_id)
        ON CONFLICT DO NOTHING;

    END
$$;

