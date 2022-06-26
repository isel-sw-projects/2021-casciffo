
---------------------------------------------------------------------------------------
---------------------------------STATE AND USER ROLES----------------------------------
---------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name VARCHAR NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS user_account (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL UNIQUE,
    user_password VARCHAR NOT NULL
);


CREATE TABLE IF NOT EXISTS user_roles (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    UNIQUE (user_id, role_id),
    CONSTRAINT fk_ur_user_id FOREIGN KEY(user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role_id FOREIGN KEY(role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS user_notification (
    notification_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    notified_user INT NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    viewed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_notified_user FOREIGN KEY(notified_user) REFERENCES user_account(user_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS states (
    state_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    state_name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS state_roles (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    state_id INT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT fk_state_id FOREIGN KEY (state_id) REFERENCES states(state_id) ON DELETE CASCADE,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS type_of_states (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    state_id INT NOT NULL,
    state_type VARCHAR NOT NULL,
    UNIQUE (state_id, state_type),
    CONSTRAINT fk_tos_state_id FOREIGN KEY (state_id) REFERENCES states(state_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS next_possible_states (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    origin_state_id INT NOT NULL,
    next_state_id INT,
    terminal_state BOOLEAN DEFAULT FALSE,
    state_type VARCHAR NOT NULL,
    CONSTRAINT check_validity CHECK ( NOT (next_state_id IS NULL AND terminal_state = FALSE) ),
    CONSTRAINT fk_origin_state FOREIGN KEY (origin_state_id) REFERENCES states(state_id) ON DELETE CASCADE,
    CONSTRAINT fk_possible_state_id FOREIGN KEY (next_state_id) REFERENCES states(state_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS state_transition (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transition_type VARCHAR NOT NULL, --proposal / addenda / research
    reference_id INT NOT NULL, --id referencing to the type
    state_id_before INT NOT NULL,
    state_id_after INT NOT NULL,
    transition_date TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_state_before FOREIGN KEY (state_id_before) REFERENCES states(state_id),
    CONSTRAINT fk_state_after FOREIGN KEY (state_id_after) REFERENCES states(state_id)
);

---------------------------------------------------------------------------------------
-----------------------------------------FILES-----------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS files (
    file_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    file_name VARCHAR NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT NOT NULL
);

---------------------------------------------------------------------------------------
---------------------------------PROPOSAL INFORMATION----------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pathology (
    pathology_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pathology_name VARCHAR
);


CREATE TABLE IF NOT EXISTS service (
    service_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    service_name VARCHAR
);

CREATE TABLE IF NOT EXISTS therapeutic_area (
    therapeutic_area_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    therapeutic_area_name VARCHAR
);


CREATE TABLE IF NOT EXISTS proposal (
    proposal_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    state_id INT NOT NULL,
    pathology_id INT NOT NULL,
    service_id INT NOT NULL,
    therapeutic_area_id INT NOT NULL,
--     protocol_state_id INT,
    sigla VARCHAR NOT NULL,
    principal_investigator_id INT NOT NULL,
    proposal_type VARCHAR NOT NULL, --clinical trial / observational study
    date_created TIMESTAMP DEFAULT NOW(),
    last_update TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_p_state_id FOREIGN KEY(state_id) REFERENCES states(state_id),
    CONSTRAINT fk_p_pathology_id FOREIGN KEY(pathology_id) REFERENCES pathology(pathology_id),
    CONSTRAINT fk_p_service_id FOREIGN KEY(service_id) REFERENCES service(service_id),
    CONSTRAINT fk_p_therapeutic_area_id FOREIGN KEY(therapeutic_area_id) REFERENCES therapeutic_area(therapeutic_area_id),
--     CONSTRAINT fk_protocol_state FOREIGN KEY(protocol_state_id) REFERENCES states(state_id),
    CONSTRAINT fk_p_principal_investigator FOREIGN KEY(principal_investigator_id) REFERENCES user_account(user_id)
);



CREATE TABLE IF NOT EXISTS proposal_files (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proposal_id INT,
    file_id INT,
    CONSTRAINT fk_proposal_id FOREIGN KEY(proposal_id)
        REFERENCES proposal(proposal_id) ON DELETE CASCADE,
    CONSTRAINT fk_file_id FOREIGN KEY(file_id) REFERENCES files(file_id)
);


CREATE TABLE IF NOT EXISTS proposal_comments (
    comment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proposal_id INT NOT NULL,
    author_id INT NOT NULL,
    date_created TIMESTAMP DEFAULT NOW(),
    date_modified TIMESTAMP,
    content TEXT NOT NULL,
    comment_type VARCHAR NOT NULL,
    CONSTRAINT fk_pc_proposal_id FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id) ON DELETE CASCADE,
    CONSTRAINT fk_author_id FOREIGN KEY(author_id) REFERENCES user_account(user_id)
);

CREATE TABLE IF NOT EXISTS timeline_event (
    event_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proposal_id INT NOT NULL,
    event_type VARCHAR NOT NULL, -- deadline / states transition
    event_name VARCHAR NOT NULL,
    event_description TEXT,
    deadline_date DATE NOT NULL,
    completed_date DATE,
    is_over_due BOOLEAN DEFAULT FALSE,
    days_over_due INT DEFAULT 0,
    is_associated_to_state BOOLEAN DEFAULT FALSE,
    state_name VARCHAR,
    CONSTRAINT  fk_te_proposal_id FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id) ON DELETE CASCADE
);

---------------------------------------------------------------------------------------
---------------------------------INVESTIGATION TEAM------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS investigation_team (
    team_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proposal_id INT NOT NULL,
    member_role VARCHAR(50) NOT NULL,
    member_id INT NOT NULL,
    CONSTRAINT fk_it_member FOREIGN KEY (member_id) REFERENCES user_account(user_id),
    CONSTRAINT fk_it_proposal FOREIGN KEY (proposal_id) REFERENCES proposal(proposal_id) ON DELETE CASCADE
);


---------------------------------------------------------------------------------------
-----------------------PROPOSAL FINANCIAL INFORMATION----------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS promoter (
    promoter_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    promoter_name VARCHAR NOT NULL,
    promoter_type VARCHAR NOT NULL,
    promoter_email VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS proposal_financial_component (
    proposal_financial_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proposal_id INT,
    financial_contract_id INT,
    promoter_id INT,
    has_partnerships BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_pfc_proposal_id FOREIGN KEY(proposal_id) REFERENCES proposal(proposal_id) ON DELETE CASCADE,
    CONSTRAINT fk_pfc_financial_contract_id FOREIGN KEY (financial_contract_id) REFERENCES files(file_id),
    CONSTRAINT fk_pfc_promoter_id FOREIGN KEY(promoter_id) REFERENCES promoter(promoter_id)
);

CREATE TABLE IF NOT EXISTS protocol (
    protocol_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    is_validated BOOLEAN DEFAULT FALSE,
    validated_date DATE,
    pfc_id INT,
    CONSTRAINT fk_protocol_pfc_id FOREIGN KEY (pfc_id)
        REFERENCES proposal_financial_component(proposal_financial_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS protocol_comments (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    protocol_id INT,
    observation TEXT,
    author_name VARCHAR,
    org_name VARCHAR,
    validated BOOLEAN DEFAULT FALSE,
    date_created DATE DEFAULT NOW(),
    CONSTRAINT fk_ptc_id FOREIGN KEY (protocol_id) REFERENCES protocol(protocol_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS partnerships (
    partnership_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proposal_financial_id INT,
    name VARCHAR NOT NULL,
    icon_url TEXT,
    representative VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone_contact VARCHAR,
    site_url TEXT,
    description TEXT
);


---------------------------------------------------------------------------------------
----------------------------------CLINICAL RESEARCH------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS clinical_research (
    research_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proposal_id INT NOT NULL,
    research_state_id INT NOT NULL,
    eudra_ct VARCHAR,
    sample_size INT,
    duration INT,
    cro VARCHAR,
    start_date DATE,
    end_date DATE,
    estimated_end_date DATE,
    industry VARCHAR,
    protocol VARCHAR,
    initiative_by VARCHAR,
    phase VARCHAR, -- phase 1 | 2 | 3 | 4,
    type VARCHAR NOT NULL,
    CONSTRAINT fk_cr_proposal_id FOREIGN KEY(proposal_id)
        REFERENCES proposal(proposal_id) ON DELETE CASCADE,
    CONSTRAINT fk_cr_state_id FOREIGN KEY(research_state_id) REFERENCES states(state_id)
);


CREATE TABLE IF NOT EXISTS dossier (
    dossier_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinical_research_id INT,
    volume VARCHAR NOT NULL,
    label VARCHAR NOT NULL,
    amount INT NOT NULL,
    CONSTRAINT fk_d_clinical_research FOREIGN KEY(clinical_research_id)
        REFERENCES clinical_research(research_id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS scientific_activities (
    activity_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    research_id INT NOT NULL,
    date_published DATE,
    author VARCHAR,
    paper_name VARCHAR,
    volume VARCHAR,
    volume_number INT,
    paper_num_pages INT,
    country_published VARCHAR,
    has_been_indexed BOOLEAN,
    published_url TEXT,
    CONSTRAINT fk_sa_research_id FOREIGN KEY(research_id)
        REFERENCES clinical_research(research_id)
        ON DELETE CASCADE
);

---------------------------------------------------------------------------------------
--------------------------------RESEARCH PARTICIPANTS----------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS participant (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    process_id BIGINT UNIQUE,
    full_name VARCHAR NOT NULL,
    gender VARCHAR NOT NULL,
    age INT NOT NULL
);


CREATE TABLE IF NOT EXISTS research_participants (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    participant_id BIGINT,
    research_id INT,
    join_date TIMESTAMP DEFAULT NOW(),
    --PRIMARY KEY (participant_id, research_id),
    CONSTRAINT fk_rp_research_id FOREIGN KEY(research_id) REFERENCES clinical_research(research_id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_participant_id FOREIGN KEY(participant_id) REFERENCES participant(id)
);


---------------------------------------------------------------------------------------
------------------------------------TRIAL VISITS---------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS clinical_visit (
    visit_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    research_id INT,
    participant_id INT,
    visit_type VARCHAR NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    periodicity VARCHAR,
    observations TEXT,
    has_adverse_event_alert BOOLEAN,
    has_marked_attendance BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_cv_research_id FOREIGN KEY(research_id)
        REFERENCES clinical_research(research_id) ON DELETE CASCADE,
    CONSTRAINT fk_cv_participant_id FOREIGN KEY(participant_id) REFERENCES participant(id)
);


CREATE TABLE IF NOT EXISTS visit_assigned_investigators (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    visit_id INT NOT NULL,
    investigator_id INT NOT NULL,
    --PRIMARY KEY (visit_id, investigator_id),
    CONSTRAINT fk_vai_visit_id FOREIGN KEY(visit_id)
        REFERENCES clinical_visit(visit_id) ON DELETE CASCADE,
    CONSTRAINT fk_vai_investigator_id FOREIGN KEY(investigator_id) REFERENCES user_account(user_id)
);

---------------------------------------------------------------------------------------
------------------------CLINICAL TRIAL FINANCIAL COMPONENTS----------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS trial_financial_component (
    financial_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    research_id INT,
    value_per_participant INT,
    role_value_per_participant INT,
    balance FLOAT,
    CONSTRAINT fk_tfc_research_id FOREIGN KEY(research_id)
        REFERENCES clinical_research(research_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS research_team_financial_scope (
    team_finance_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trial_financial_component_id INT,
    investigator_id INT, 
    type_of_flow VARCHAR NOT NULL,
    transaction_date TIMESTAMP DEFAULT NOW(),
    responsible_for_payment VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    partition_percentage NUMERIC(5,2) NOT NULL,
    role_amount FLOAT NOT NULL,
    CONSTRAINT fk_rtfc_trial_financial_component
        FOREIGN KEY (trial_financial_component_id)
            REFERENCES trial_financial_component(financial_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_rtfc_investigator_id FOREIGN KEY (investigator_id) REFERENCES user_account(user_id)
);

CREATE TABLE IF NOT EXISTS research_finance (
    research_finance_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trial_financial_component_id INT,
    transaction_date TIMESTAMP DEFAULT NOW(),
    type_of_flow VARCHAR NOT NULL,
    motive VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    CONSTRAINT fk_rf_trial_financial_component FOREIGN KEY(trial_financial_component_id)
        REFERENCES trial_financial_component(financial_id)
        ON DELETE CASCADE
);


---------------------------------------------------------------------------------------
---------------------------------------ADDENDA-----------------------------------------
---------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS addenda (
    addenda_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    research_id INT NOT NULL,
    addenda_state_id INT NOT NULL,
    addenda_file_id INT NOT NULL,
    CONSTRAINT fk_a_research_id FOREIGN KEY(research_id) REFERENCES clinical_research(research_id) ON DELETE CASCADE,
    CONSTRAINT fk_addenda_state FOREIGN KEY(addenda_state_id) REFERENCES states(state_id),
    CONSTRAINT fk_a_file_id FOREIGN KEY(addenda_file_id) REFERENCES files(file_id)
);
