DO
$$
    DECLARE
        uic_role_id INT;
        ca_role_id INT;
        finance_role_id INT;
        juridical_role_id INT;
        superuser_role_id INT;
        first_admin_id INT;
        state_submetido_id INT;
        state_validacao_cf_id INT;
        state_validacao_externa_id INT;
        state_submissao_ao_ca_id INT;
        state_validacao_interna_ca_id INT;
        state_validacao_interna_uic_id INT;
        state_validado_id INT;
        state_completo_id INT;
        state_cancelado_id INT;
        state_indeferido_id INT;
        state_ativo_id INT;
    BEGIN

        --ROLES
        INSERT INTO roles(role_name)
        VALUES ('SUPERUSER'), ('CA'), ('UIC'), ('FINANCE'), ('JURIDICAL')
        ON CONFLICT (role_name) DO NOTHING;

        uic_role_id := (SELECT role_id FROM roles WHERE role_name='UIC' LIMIT 1);
        ca_role_id := (SELECT role_id FROM roles WHERE role_name='CA' LIMIT 1);
        finance_role_id := (SELECT role_id FROM roles WHERE role_name='FINANCE' LIMIT 1);
        juridical_role_id := (SELECT role_id FROM roles WHERE role_name='JURIDICAL' LIMIT 1);
        superuser_role_id := (SELECT role_id FROM roles WHERE role_name='SUPERUSER' LIMIT 1);

        --USERS password is 123456 encrypted
        INSERT INTO user_account(user_name, user_email, user_password)
        VALUES ('admin', 'casciffo.admin@admin.pt', '$2a$10$2X2vmd5NthkKodbVnEGw8./LW0pdx46vr8MqlCg2tc742rPRbDwgG')
        ON CONFLICT (user_email) DO NOTHING;

        first_admin_id := (SELECT user_id FROM user_account WHERE user_email='casciffo.admin@admin.pt' LIMIT 1);

        INSERT INTO user_roles(user_id, role_id)
        VALUES (first_admin_id, superuser_role_id)
        ON CONFLICT DO NOTHING;

        raise notice 'Value: %', first_admin_id;

        --STATES
        INSERT INTO states(state_name)
        VALUES ('SUBMETIDO'),
               ('VALIDACAO_CF'),
               ('VALIDACAO_EXTERNA'),
               ('SUBMISSAO_AO_CA'),
               ('VALIDACAO_INTERNA_UIC'),
               ('VALIDACAO_INTERNA_CA'),
               ('VALIDADO'),
               ('ATIVO'),
               ('COMPLETO'),
               ('CANCELADO'),
               ('INDEFERIDO')
        ON CONFLICT DO NOTHING;

        state_submetido_id := (SELECT state_id FROM states WHERE state_name = 'SUBMETIDO');
        state_validacao_cf_id := (SELECT state_id FROM states WHERE state_name = 'VALIDACAO_CF');
        state_validacao_externa_id := (SELECT state_id FROM states WHERE state_name = 'VALIDACAO_EXTERNA');
        state_submissao_ao_ca_id := (SELECT state_id FROM states WHERE state_name = 'SUBMISSAO_AO_CA');
        state_validacao_interna_ca_id := (SELECT state_id FROM states WHERE state_name = 'VALIDACAO_INTERNA_CA');
        state_validacao_interna_uic_id := (SELECT state_id FROM states WHERE state_name = 'VALIDACAO_INTERNA_UIC');
        state_validado_id := (SELECT state_id FROM states WHERE state_name = 'VALIDADO');
        state_completo_id := (SELECT state_id FROM states WHERE state_name = 'COMPLETO');
        state_cancelado_id := (SELECT state_id FROM states WHERE state_name = 'CANCELADO');
        state_indeferido_id := (SELECT state_id FROM states WHERE state_name = 'INDEFERIDO');
        state_ativo_id := (SELECT state_id FROM states WHERE state_name = 'ATIVO');

        --STATE ROLES
        INSERT INTO state_roles(state_id, role_id)
        VALUES (state_submetido_id, uic_role_id),
               (state_validacao_externa_id, uic_role_id),
               (state_submissao_ao_ca_id, uic_role_id),
               (state_ativo_id, uic_role_id),
               (state_validacao_cf_id, finance_role_id),
               (state_validacao_cf_id, juridical_role_id),
               (state_validacao_interna_ca_id, ca_role_id),
               (state_validacao_interna_uic_id, uic_role_id),
               (state_indeferido_id, uic_role_id),
               (state_indeferido_id, ca_role_id),
               (state_validado_id, superuser_role_id),
               (state_completo_id, superuser_role_id),
               (state_cancelado_id, superuser_role_id),
               (state_indeferido_id, superuser_role_id),
               (state_ativo_id, superuser_role_id),
               (state_submetido_id, superuser_role_id),
               (state_validacao_cf_id, superuser_role_id),
               (state_validacao_externa_id, superuser_role_id),
               (state_submissao_ao_ca_id, superuser_role_id),
               (state_validacao_interna_ca_id, superuser_role_id),
               (state_validacao_interna_uic_id, superuser_role_id)
        ON CONFLICT DO NOTHING;

        --NEXT STATES
        INSERT INTO next_possible_states(origin_state_id, next_state_id, state_type, state_flow_type)
        VALUES
                --FINANCE PROPOSAL
                (state_submetido_id, state_validacao_cf_id, 'FINANCE_PROPOSAL', 'INITIAL'),
                (state_validacao_cf_id, state_validacao_externa_id, 'FINANCE_PROPOSAL', 'PROGRESS'),
                (state_validacao_externa_id, state_submissao_ao_ca_id, 'FINANCE_PROPOSAL', 'PROGRESS'),
                (state_submissao_ao_ca_id, state_validacao_interna_ca_id, 'FINANCE_PROPOSAL', 'PROGRESS'),
                (state_validacao_interna_ca_id, state_validado_id, 'FINANCE_PROPOSAL', 'PROGRESS'),
                (state_validado_id, NULL, 'FINANCE_PROPOSAL', 'TERMINAL'),

                --STUDY PROPOSAL
                (state_submetido_id, state_validacao_interna_ca_id, 'STUDY_PROPOSAL', 'INITIAL'),
                (state_validacao_interna_ca_id, state_validado_id, 'STUDY_PROPOSAL', 'PROGRESS'),
                (state_validado_id, NULL, 'STUDY_PROPOSAL', 'TERMINAL'),

                --ADDENDA
                (state_submetido_id, state_validacao_interna_uic_id, 'ADDENDA', 'INITIAL'),
                (state_validacao_interna_uic_id, state_validacao_interna_ca_id, 'ADDENDA', 'PROGRESSS'),
                (state_validacao_interna_ca_id, state_validado_id, 'ADDENDA', 'PROGRESS'),
                (state_validado_id, NULL, 'ADDENDA', 'TERMINAL'),
                (state_indeferido_id, NULL, 'ADDENDA', 'TERMINAL'),

                --ENSAIO
                (state_ativo_id, state_completo_id, 'RESEARCH', 'INITIAL'),
                (state_completo_id, NULL, 'RESEARCH', 'TERMINAL'),

                --ALL
                (state_cancelado_id, NULL, 'ALL', 'TERMINAL')
        ON CONFLICT(origin_state_id, next_state_id, state_type) DO NOTHING;

        insert into service (service_name)
        values
            ('Anatomia Patológica'),
            ('Anestesiologia'),
            ('Cardiologia'),
            ('Cirurgia Geral'),
            ('Gastrenterologia'),
            ('Ginecologia'),
            ('Imagiologia'),
            ('Infecciologia'),
            ('Medicina Física e de Reabilitação'),
            ('Medicina I'),
            ('Medicina II'),
            ('Medicina III'),
            ('Medicina IV'),
            ('Nefrologia'),
            ('Neonatologia'),
            ('Neurologia'),
            ('Neurorradiologia'),
            ('Obstetrícia'),
            ('Oftalmologia'),
            ('Oncologia'),
            ('Ortopedia'),
            ('Otorrinolaringologia'),
            ('Patologia Clinica'),
            ('Pediatria'),
            ('Pneumologia'),
            ('Psiquiatria e Saúde Mental da Infância e Adolescência'),
            ('Psiquiatria e Saúde Mental de Adultos'),
            ('Sangue e Medicina Transfusional'),
            ('UCI'),
            ('Unidade da Dor'),
            ('Urgência'),
            ('Urgência Geral e Urgência Básica'),
            ('Urgência Obstétrica e Ginecológica'),
            ('Urologia') ON CONFLICT DO NOTHING ;

        insert into therapeutic_area(therapeutic_area_name)
        values
            ('Alimentação e dietética'),
            ('Anatomia Patológica'),
            ('Anestesiologia'),
            ('Cardiologia'),
            ('Cirurgia C'),
            ('Cirurgia A'),
            ('Departamento de Saúde Mental'),
            ('Gastroenterologia'),
            ('Ginecologia'),
            ('Infecciologia'),
            ('Medicina I'),
            ('Medicina II'),
            ('Medicina III'),
            ('Medicina IV'),
            ('Nefrologia'),
            ('Neurologia'),
            ('Oftalmologia'),
            ('Oncologia'),
            ('ORL'),
            ('Ortopedia'),
            ('Pediatria'),
            ('Pneumologia'),
            ('Psiquiatria'),
            ('SMI'),
            ('UCIENP'),
            ('UCIP'),
            ('Unidade Dor'),
            ('Urgência Geral'),
            ('Urologia'),
            ('Ucicre') ON CONFLICT DO NOTHING;

        insert into pathology(pathology_name)
        values
            ('Antineoplásicos e Imunomoduladores (L)'),
            ('Anti-Infecciosos (J)'),
            ('Sistema Nervoso Central (N)'),
            ('Sistema Cardio-Vascular (C)'),
            ('Orgão dos Sentidos (S)'),
            ('Sangue e Hematopoiéticos (B)'),
            ('Gastrointestinal e Metabolico (A)'),
            ('Sistema Musculo Esquelético (M)'),
            ('Sistema Respiratório (R)'),
            ('Restantes ATC *'),
            ('* Sistema Endócrino (H)'),
            ('* Sistema Genito-Urinário e Hormonas Sexuais (G)'),
            ('* Dermatológicos (D)'),
            ('* Vários (V)'),
            ('*Antiparasitários, Inseticidas e Repelentes (P)'),
            ('Anti-Alérgicos'),
            ('Nutrição'),
            ('Correctivos da volémia e das alterações electrolíticas'),
            ('Medicamentos usados em afecções Otorrinolaringológicas'),
            ('Medicamentos usados em afecções Oculares') ON CONFLICT DO NOTHING;
    END
$$;

